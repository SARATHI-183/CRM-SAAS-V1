// src/modules/super-admin/controller.js
const service = require('./service');

async function createTenantHandler(req, res, next) {
  try {
    const payload = req.body;
    const result = await service.createTenant(payload);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTenantHandler };
