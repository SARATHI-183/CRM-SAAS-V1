// const db = require("../db/connection");

// // GET ALL ROLES (Super Admin = all, Tenant = only their roles)
// async function listRoles(req, res) {
//   try {
//     const user = req.user; // from auth middleware

//     let roles;

//     if (user.role_id === 1) {
//       // SUPER ADMIN → See ALL roles (system roles + tenant roles)
//       roles = await db("roles")
//         .select("id", "tenant_id", "role_name", "description", "is_system_role", "created_at")
//         .orderBy("id", "asc");
//     } else {
//       // TENANT USERS → See system roles + their tenant roles
//       roles = await db("roles")
//         .where(function () {
//           this.where("tenant_id", user.tenant_id).orWhereNull("tenant_id");
//         })
//         .select("id", "tenant_id", "role_name", "description", "is_system_role", "created_at")
//         .orderBy("id", "asc");
//     }

//     res.json({ count: roles.length, roles });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// }

// // GET ONE ROLE
// async function getRole(req, res) {
//   try {
//     const { id } = req.params;
//     const role = await db("roles").where({ id }).first();

//     if (!role) return res.status(404).json({ message: "Role not found" });

//     // Tenant users cannot access roles of other tenants
//     if (req.user.role_id !== 1 && role.tenant_id !== req.user.tenant_id && role.tenant_id !== null) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     res.json(role);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// }

// // CREATE ROLE (ONLY TENANT ADMIN or SUPER ADMIN)
// async function createRole(req, res) {
//   try {
//     const { role_name, description } = req.body;
//     const user = req.user;

//     if (!role_name) return res.status(400).json({ message: "role_name required" });

//     const tenantId = user.role_id === 1 ? req.body.tenant_id || null : user.tenant_id;

//     const [role] = await db("roles")
//       .insert({
//         tenant_id: tenantId,
//         role_name,
//         description,
//         is_system_role: tenantId === null, // true only for system roles
//       })
//       .returning(["id", "tenant_id", "role_name", "description", "is_system_role", "created_at"]);

//     res.status(201).json({ role });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// }

// // DELETE ROLE
// async function deleteRole(req, res) {
//   try {
//     const { id } = req.params;
//     const user = req.user;

//     const role = await db("roles").where({ id }).first();
//     if (!role) return res.status(404).json({ message: "Role not found" });

//     if (role.is_system_role)
//       return res.status(400).json({ message: "Cannot delete system roles" });

//     if (user.role_id !== 1 && role.tenant_id !== user.tenant_id)
//       return res.status(403).json({ message: "Forbidden" });

//     await db("roles").where({ id }).del();

//     res.json({ message: "Role deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// }

// module.exports = { listRoles, getRole, createRole, deleteRole };


const db = require("../db/connection");
const { validate: isUuid } = require("uuid");

// GET ALL ROLES (Super Admin = all, Tenant = only their roles)
async function listRoles(req, res) {
  try {
    const user = req.user; // from auth middleware

    let roles;

    if (user.role_id === 1) {
      // SUPER ADMIN → See ALL roles (system + tenant roles)
      roles = await db("roles")
        .select("id", "tenant_id", "role_name", "description", "is_system_role", "created_at")
        .orderBy("id", "asc");
    } else {
      // TENANT USERS → See system roles + their tenant roles
      roles = await db("roles")
        .where(function () {
          this.where("tenant_id", user.tenant_id).orWhereNull("tenant_id");
        })
        .select("id", "tenant_id", "role_name", "description", "is_system_role", "created_at")
        .orderBy("id", "asc");
    }

    res.json({ count: roles.length, roles });
  } catch (err) {
    console.error("listRoles:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

// GET ONE ROLE
async function getRole(req, res) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ message: "Invalid role id" });

    const role = await db("roles").where({ id }).first();
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Tenant users cannot access roles of other tenants
    if (
      req.user.role_id !== 1 &&
      role.tenant_id &&
      role.tenant_id !== req.user.tenant_id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(role);
  } catch (err) {
    console.error("getRole:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

// CREATE ROLE (ONLY TENANT ADMIN or SUPER ADMIN)
async function createRole(req, res) {
  try {
    const { role_name, description } = req.body;
    const user = req.user;

    if (!role_name) return res.status(400).json({ message: "role_name required" });

    const tenantId = user.role_id === 1 ? req.body.tenant_id || null : user.tenant_id;
    if (tenantId && !isUuid(tenantId)) return res.status(400).json({ message: "Invalid tenant_id" });

    const [role] = await db("roles")
      .insert({
        tenant_id: tenantId,
        role_name,
        description,
        is_system_role: tenantId === null, // system roles only
      })
      .returning(["id", "tenant_id", "role_name", "description", "is_system_role", "created_at"]);

    res.status(201).json({ role });
  } catch (err) {
    console.error("createRole:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

// DELETE ROLE
async function deleteRole(req, res) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ message: "Invalid role id" });

    const user = req.user;
    const role = await db("roles").where({ id }).first();
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (role.is_system_role)
      return res.status(400).json({ message: "Cannot delete system roles" });

    if (user.role_id !== 1 && role.tenant_id !== user.tenant_id)
      return res.status(403).json({ message: "Forbidden" });

    await db("roles").where({ id }).del();

    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error("deleteRole:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { listRoles, getRole, createRole, deleteRole };
