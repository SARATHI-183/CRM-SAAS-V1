// const db = require("../../db/connection");
// const bcrypt = require("bcryptjs");
// const { validate: isUuid } = require("uuid");

// // -------------------------
// // Helper: Get role_key of logged-in user
// // -------------------------
// async function getRoleKey(role_id) {
//   const role = await db("roles").where({ id: role_id }).first();
//   return role ? role.role_key : null;
// }

// // -------------------------
// // CREATE USER
// // -------------------------
// async function createUserService(invoker, data) {
//   const { full_name, email, password, role_id, tenant_id } = data;

//   const invokerRoleKey = await getRoleKey(invoker.role_id);

//   let targetTenantId;

//   if (invokerRoleKey === "super_admin") {
//     targetTenantId = tenant_id || null;

//     if (targetTenantId) {
//       const tenantExists = await db("tenants").where({ id: targetTenantId }).first();
//       if (!tenantExists) {
//         return { error: "Invalid tenant_id" };
//       }
//     }
//   } else {
//     targetTenantId = invoker.tenant_id;
//   }

//   const existing = await db("users").where({ email }).first();
//   if (existing) return { error: "Email already exists", status: 409 };

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const [created] = await db("users")
//     .insert({
//       full_name,
//       email,
//       password: hashedPassword,
//       role_id,
//       tenant_id: targetTenantId,
//       is_active: true,
//     })
//     .returning([
//       "id",
//       "full_name",
//       "email",
//       "role_id",
//       "tenant_id",
//       "is_active",
//       "created_at",
//     ]);

//   return { data: created };
// }

// // -------------------------
// // LIST USERS
// // -------------------------
// async function listUsersService(invoker, query) {
//   const invokerRoleKey = await getRoleKey(invoker.role_id);

//   let users;

//   if (invokerRoleKey === "super_admin") {
//     const tenantId = query.tenant_id;

//     if (tenantId && !isUuid(tenantId)) {
//       return { error: "Invalid tenant_id" };
//     }

//     users = tenantId
//       ? await db("users").where({ tenant_id: tenantId })
//       : await db("users");
//   } else {
//     users = await db("users").where({ tenant_id: invoker.tenant_id });
//   }

//   return { data: users };
// }

// // -------------------------
// // GET USER BY ID
// // -------------------------
// async function getUserService(invoker, id) {
//   const user = await db("users").where({ id }).first();
//   if (!user) return { error: "User not found", status: 404 };

//   const invokerRoleKey = await getRoleKey(invoker.role_id);

//   if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
//     return { error: "Forbidden", status: 403 };
//   }

//   const { password, ...safe } = user;
//   return { data: safe };
// }

// // -------------------------
// // UPDATE USER
// // -------------------------
// async function updateUserService(invoker, id, updates) {
//   const user = await db("users").where({ id }).first();
//   if (!user) return { error: "User not found", status: 404 };

//   const invokerRoleKey = await getRoleKey(invoker.role_id);

//   if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
//     return { error: "Forbidden", status: 403 };
//   }

//   const updateData = {};

//   if (updates.email && updates.email !== user.email) {
//     const exists = await db("users")
//       .where({ email: updates.email })
//       .whereNot({ id })
//       .first();

//     if (exists) return { error: "Email already exists", status: 409 };

//     updateData.email = updates.email;
//   }

//   if (updates.full_name) updateData.full_name = updates.full_name;
//   if (updates.phone) updateData.phone = updates.phone;
//   if (typeof updates.is_active === "boolean") updateData.is_active = updates.is_active;

//   if (updates.role_id && invokerRoleKey === "super_admin") {
//     if (!isUuid(updates.role_id)) return { error: "Invalid role_id" };

//     updateData.role_id = updates.role_id;
//   }

//   updateData.updated_at = new Date();

//   const [updated] = await db("users")
//     .where({ id })
//     .update(updateData)
//     .returning([
//       "id",
//       "full_name",
//       "email",
//       "role_id",
//       "tenant_id",
//       "is_active",
//       "updated_at",
//     ]);

//   return { data: updated };
// }

// // -------------------------
// // SOFT DELETE USER
// // -------------------------
// async function softDeleteUserService(invoker, id) {
//   const user = await db("users").where({ id }).first();
//   if (!user) return { error: "User not found", status: 404 };

//   const invokerRoleKey = await getRoleKey(invoker.role_id);

//   if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
//     return { error: "Forbidden", status: 403 };
//   }

//   await db("users").where({ id }).update({
//     is_active: false,
//     updated_at: new Date(),
//   });

//   return { data: { ...user, is_active: false } };
// }

// // -------------------------
// // HARD DELETE USER
// // -------------------------
// async function hardDeleteUserService(invoker, id) {
//   const user = await db("users").where({ id }).first();
//   if (!user) return { error: "User not found", status: 404 };

//   const invokerRoleKey = await getRoleKey(invoker.role_id);

//   if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
//     return { error: "Forbidden", status: 403 };
//   }

//   await db("users").where({ id }).del();

//   return { data: { id: user.id } };
// }

// module.exports = {
//   createUserService,
//   listUsersService,
//   getUserService,
//   updateUserService,
//   softDeleteUserService,
//   hardDeleteUserService,
// };

const db = require("../../db/connection");
const bcrypt = require("bcryptjs");
const { validate: isUuid } = require("uuid");

// Helper: get role_key of a user
async function getRoleKey(role_id) {
  const role = await db("roles").where({ id: role_id }).first();
  return role ? role.role_key : null;
}

// ---------- CREATE USER ----------
async function createUserService(invoker, data) {
  const { full_name, email, password, role_id, tenant_id } = data;

  // Super admin or tenant logic
  const invokerRoleKey = await getRoleKey(invoker.role_id);

  let targetTenantId;
  if (invokerRoleKey === "super_admin") {
    targetTenantId = tenant_id || null;

    if (targetTenantId) {
      const tenantExists = await db("tenants").where({ id: targetTenantId }).first();
      if (!tenantExists) throw new Error("Invalid tenant_id");
    }
  } else {
    targetTenantId = invoker.tenant_id;
  }

  // Check email duplicate
  const existing = await db("users").where({ email }).first();
  if (existing) throw new Error("Email already exists");

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

  return created;
}

// ---------- LIST USERS ----------
async function listUsersService(invoker, query) {
  const invokerRoleKey = await getRoleKey(invoker.role_id);

  if (invokerRoleKey === "super_admin") {
    const tenantId = query.tenant_id;

    if (tenantId && !isUuid(tenantId)) throw new Error("Invalid tenant_id");

    return tenantId
      ? await db("users").where({ tenant_id: tenantId })
      : await db("users");
  } else {
    return await db("users").where({ tenant_id: invoker.tenant_id });
  }
}

// ---------- GET USER ----------
async function getUserService(invoker, userId) {
  if (!isUuid(userId)) throw new Error("Invalid user ID");

  const user = await db("users").where({ id: userId }).first();
  if (!user) throw new Error("User not found");

  const invokerRoleKey = await getRoleKey(invoker.role_id);
  if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
    throw new Error("Forbidden");
  }

  const { password, ...safe } = user;
  return safe;
}

// ---------- UPDATE USER ----------
async function updateUserService(invoker, userId, data) {
  if (!isUuid(userId)) throw new Error("Invalid user ID");

  const user = await db("users").where({ id: userId }).first();
  if (!user) throw new Error("User not found");

  const invokerRoleKey = await getRoleKey(invoker.role_id);
  if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
    throw new Error("Forbidden");
  }

  const updateData = {};
  const { full_name, phone, is_active, role_id, email } = data;

  if (email && email !== user.email) {
    const existing = await db("users").where({ email }).whereNot({ id: userId }).first();
    if (existing) throw new Error("Email already exists");
    updateData.email = email;
  }

  if (full_name) updateData.full_name = full_name;
  if (phone) updateData.phone = phone;
  if (typeof is_active === "boolean") updateData.is_active = is_active;

  if (role_id && invokerRoleKey === "super_admin") {
    if (!isUuid(role_id)) throw new Error("Invalid role_id");
    updateData.role_id = role_id;
  }

  updateData.updated_at = new Date();

  const [updated] = await db("users")
    .where({ id: userId })
    .update(updateData)
    .returning(["id", "full_name", "email", "role_id", "tenant_id", "is_active", "updated_at"]);

  return updated;
}

// ---------- DELETE USER (soft) ----------
async function deleteUserService(invoker, userId) {
  if (!isUuid(userId)) throw new Error("Invalid user ID");

  const user = await db("users").where({ id: userId }).first();
  if (!user) throw new Error("User not found");

  const invokerRoleKey = await getRoleKey(invoker.role_id);
  if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
    throw new Error("Forbidden");
  }

  await db("users").where({ id: userId }).update({
    is_active: false,
    updated_at: new Date(),
  });

  return { ...user, is_active: false };
}

// ---------- HARD DELETE USER ----------
async function hardDeleteUserService(invoker, userId) {
  if (!isUuid(userId)) throw new Error("Invalid user ID");

  const user = await db("users").where({ id: userId }).first();
  if (!user) throw new Error("User not found");

  const invokerRoleKey = await getRoleKey(invoker.role_id);
  if (invokerRoleKey !== "super_admin" && user.tenant_id !== invoker.tenant_id) {
    throw new Error("Forbidden");
  }

  await db("users").where({ id: userId }).del();
  return { id: user.id };
}

// module.exports = {
//   createUserService,
//   listUsersService,
//   getUserService,
//   updateUserService,
//   deleteUserService,
//   hardDeleteUserService,
// };
module.exports = {
  createUser: createUserService,
  listUsers: listUsersService,
  getUser: getUserService,
  updateUser: updateUserService,
  deleteUser: deleteUserService,
  hardDeleteUser: hardDeleteUserService,
};
