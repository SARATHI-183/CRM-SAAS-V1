const db = require("../db/connection");
const bcrypt = require("bcryptjs");

//
// Create a new user inside a tenant
//
async function createUser(req, res) {
  try {
    const invoker = req.user; // logged-in user {id, role_id, tenant_id}
    const { full_name, email, password, role_id, tenant_id } = req.body;

    // validation
    if (!full_name || !email || !password || !role_id) {
      return res.status(400).json({
        message: "full_name, email, password, role_id required",
      });
    }

    // find target tenant
    let targetTenantId;

    if (invoker.role_id === 1) {
      // super admin = can create in any tenant
      targetTenantId = tenant_id;
    } else {
      // tenant admin = always own tenant
      targetTenantId = invoker.tenant_id;
    }

    // Check tenant exists if super admin creating
    if (invoker.role_id === 1 && tenant_id) {
      const tenantExists = await db("tenants").where({ id: tenant_id }).first();
      if (!tenantExists) {
        return res.status(400).json({ message: "Invalid tenant_id" });
      }
    }

    // check email uniqueness globally
    const existing = await db("users").where({ email }).first();
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

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
      .returning([
        "id",
        "full_name",
        "email",
        "role_id",
        "tenant_id",
        "is_active",
        "created_at",
      ]);

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

//
// List users — Super Admin sees all; others only their tenant
//
async function listUsers(req, res) {
  try {
    let users;

    if (req.user.role_id === 1) {
      // super admin
      users = await db("users").select(
        "id",
        "tenant_id",
        "role_id",
        "full_name",
        "email",
        "is_active",
        "created_at"
      );
    } else {
      // tenant admin / normal user
      users = await db("users")
        .where({ tenant_id: req.user.tenant_id })
        .select(
          "id",
          "tenant_id",
          "role_id",
          "full_name",
          "email",
          "is_active",
          "created_at"
        );
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

//
// Get Single User – Tenant Isolated
//
async function getUser(req, res) {
  try {
    const { id } = req.params;

    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    // tenant isolation
    if (req.user.role_id !== 1 && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { password, ...safe } = user;
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

//
// Update User
//
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { full_name, phone, is_active, role_id } = req.body;

    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    // tenant isolation
    if (req.user.role_id !== 1 && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updateData = {};

    if (full_name) updateData.full_name = full_name;
    if (phone) updateData.phone = phone;
    if (typeof is_active === "boolean") updateData.is_active = is_active;

    // Only super admin can change roles
    if (role_id && req.user.role_id === 1) {
      updateData.role_id = role_id;
    }

    updateData.updated_at = new Date();

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
        "updated_at",
      ]);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

//
// Soft delete user (disable)
//
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role_id !== 1 && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db("users").where({ id }).update({
      is_active: false,
      updated_at: new Date(),
    });

    res.json({ message: "User deactivated" });
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
};
