

const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const { validate: isUuid } = require("uuid");

// Helper: get logged-in user's role_key
async function getRoleKey(role_id) {
  const role = await db("roles").where({ id: role_id }).first();
  return role ? role.role_key : null;
}

async function createUser(req, res) {
  try {
    const invoker = req.user;
    const { full_name, email, password, role_id, tenant_id } = req.body;

    if (!full_name || !email || !password || !role_id) {
      return res.status(400).json({
        message: "full_name, email, password, role_id required",
      });
    }

    if (!isUuid(role_id)) return res.status(400).json({ message: "Invalid role_id" });
    if (tenant_id && !isUuid(tenant_id)) return res.status(400).json({ message: "Invalid tenant_id" });

    const invokerRoleKey = await getRoleKey(invoker.role_id);

    let targetTenantId;

    if (invokerRoleKey === "super_admin") {
      // Super Admin can create in any tenant
      targetTenantId = tenant_id || null;

      if (targetTenantId) {
        const tenantExists = await db("tenants").where({ id: targetTenantId }).first();
        if (!tenantExists) return res.status(400).json({ message: "Invalid tenant_id" });
      }
    } else {
      // Tenant Admin creates only inside own tenant
      targetTenantId = invoker.tenant_id;
    }

    const existing = await db("users").where({ email }).first();
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const [created] = await db("users")
      .insert({
        full_name,
        email,
        password: hashed,
        role_id,
        tenant_id: targetTenantId,
        is_active: true,
      })
      .returning(["id", "full_name", "email", "role_id", "tenant_id", "is_active", "created_at"]);

    res.status(201).json(created);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listUsers(req, res) {
  try {
    const invokerRoleKey = await getRoleKey(req.user.role_id);

    let users;

    if (invokerRoleKey === "super_admin") {
      // Optional filter
      const tenantId = req.query.tenant_id;

      if (tenantId && !isUuid(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant_id" });
      }

      users = tenantId
        ? await db("users").where({ tenant_id: tenantId })
        : await db("users");
    } else {
      // Tenant only sees own tenant users
      users = await db("users").where({ tenant_id: req.user.tenant_id });
    }

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const invokerRoleKey = await getRoleKey(req.user.role_id);

    if (invokerRoleKey !== "super_admin" && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { password, ...safe } = user;
    res.json(safe);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// async function updateUser(req, res) {
//   try {
//     const { id } = req.params;
//     if (!isUuid(id)) return res.status(400).json({ message: "Invalid user ID" });

//     const { full_name, phone, is_active, role_id } = req.body;

//     const user = await db("users").where({ id }).first();
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const invokerRoleKey = await getRoleKey(req.user.role_id);

//     if (invokerRoleKey !== "super_admin" && user.tenant_id !== req.user.tenant_id) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const updateData = {};
//     if (full_name) updateData.full_name = full_name;
//     if (phone) updateData.phone = phone;
//     if (typeof is_active === "boolean") updateData.is_active = is_active;

//     if (role_id && invokerRoleKey === "super_admin") {
//       if (!isUuid(role_id)) return res.status(400).json({ message: "Invalid role_id" });
//       updateData.role_id = role_id;
//     }

//     updateData.updated_at = new Date();

//     const [updated] = await db("users")
//       .where({ id })
//       .update(updateData)
//       .returning(["id","full_name","email","role_id","tenant_id","is_active","updated_at"]);

//     res.json(updated);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ message: "Invalid user ID" });

    const { full_name, phone, is_active, role_id, email } = req.body;

    // Find existing user
    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const invokerRoleKey = await getRoleKey(req.user.role_id);

    // Tenant restriction
    if (invokerRoleKey !== "super_admin" && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updateData = {};

    // -------- EMAIL UPDATE & DUPLICATE CHECK ----------
    if (email && email !== user.email) {
      // Check if another user already uses the email
      const existing = await db("users")
        .where({ email })
        .whereNot({ id })          // exclude the current user
        .first();

      if (existing) {
        return res.status(409).json({ message: "Email already exists" });
      }

      updateData.email = email;
    }

    // -------- OTHER FIELDS ---------------
    if (full_name) updateData.full_name = full_name;
    if (phone) updateData.phone = phone;
    if (typeof is_active === "boolean") updateData.is_active = is_active;

    // Super admin can change role
    if (role_id && invokerRoleKey === "super_admin") {
      if (!isUuid(role_id)) return res.status(400).json({ message: "Invalid role_id" });
      updateData.role_id = role_id;
    }

    updateData.updated_at = new Date();

    // -------- UPDATE IN DB -------------
    const [updated] = await db("users")
      .where({ id })
      .update(updateData)
      .returning([
        "id",
        "full_name",
        "email",
        "role_id",
        "tenant_id",
        "is_active",
        "updated_at"
      ]);

    res.json(updated);

  } catch (err) {
    console.error("updateUser:", err);
    res.status(500).json({ message: "Server error" });
  }
}


async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const invokerRoleKey = await getRoleKey(req.user.role_id);

    if (invokerRoleKey !== "super_admin" && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db("users").where({ id }).update({
      is_active: false,
      updated_at: new Date()
    });

    res.json({
      message: "User deactivated",
      user: { ...user, is_active: false },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function hardDeleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const invokerRoleKey = await getRoleKey(req.user.role_id);

    if (invokerRoleKey !== "super_admin" && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db("users").where({ id }).del();

    res.json({ message: "User permanently deleted", id: user.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  hardDeleteUser
};
