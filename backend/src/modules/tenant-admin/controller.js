const { createTenantAdmin } = require('./service');

async function addTenantAdmin(req, res, next) {
  try {
    const tenantSchema = req.user.db_schema; // JWT contains tenant info
    const payload = req.body; // { full_name, email, password }
    const admin = await createTenantAdmin(tenantSchema, payload);
    res.status(201).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
}

module.exports = { addTenantAdmin };
