const db = require("../db/connection");

async function saveAuditLog({
  tenant_id,
  user_id,
  module,
  action,
  entity_id,
  old_data,
  new_data,
  req
}) {
  try {
    await db("audit_logs").insert({
      tenant_id,
      user_id,
      module,
      action,
      entity_id,
      old_data,
      new_data,
      ip_address: req?.ip || null,
      user_agent: req?.headers["user-agent"] || null,
    });
  } catch (err) {
    console.error("Error saving audit log:", err);
  }
}

module.exports = { saveAuditLog };
