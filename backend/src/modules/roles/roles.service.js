const db = require("../../db/connection");
const { validate: isUuid } = require("uuid");

async function listRoles(user) {
  if (user.role_id === 1) {
    return db("roles").select("id", "tenant_id", "role_name", "description", "is_system_role", "created_at").orderBy("id");
  } else {
    return db("roles")
      .where(function () {
        this.where("tenant_id", user.tenant_id).orWhereNull("tenant_id");
      })
      .select("id", "tenant_id", "role_name", "description", "is_system_role", "created_at")
      .orderBy("id");
  }
}

async function getRole(user, id) {
  if (!isUuid(id)) throw { status: 400, message: "Invalid role id" };

  const role = await db("roles").where({ id }).first();
  if (!role) throw { status: 404, message: "Role not found" };

  if (user.role_id !== 1 && role.tenant_id && role.tenant_id !== user.tenant_id) {
    throw { status: 403, message: "Forbidden" };
  }

  return role;
}

async function createRole(user, data) {
  const { role_name, description, tenant_id: bodyTenantId } = data;
  if (!role_name) throw { status: 400, message: "role_name required" };

  const tenantId = user.role_id === 1 ? bodyTenantId || null : user.tenant_id;
  if (tenantId && !isUuid(tenantId)) throw { status: 400, message: "Invalid tenant_id" };

  const [role] = await db("roles")
    .insert({
      tenant_id: tenantId,
      role_name,
      description,
      is_system_role: tenantId === null,
    })
    .returning(["id", "tenant_id", "role_name", "description", "is_system_role", "created_at"]);

  return role;
}

async function deleteRole(user, id) {
  if (!isUuid(id)) throw { status: 400, message: "Invalid role id" };

  const role = await db("roles").where({ id }).first();
  if (!role) throw { status: 404, message: "Role not found" };

  if (role.is_system_role) throw { status: 400, message: "Cannot delete system roles" };
  if (user.role_id !== 1 && role.tenant_id !== user.tenant_id) throw { status: 403, message: "Forbidden" };

  await db("roles").where({ id }).del();
}

module.exports = { listRoles, getRole, createRole, deleteRole };
