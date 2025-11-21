// src/controllers/tenants.controller.js
const tenantsService = require("./tenants.service");

async function createTenant(req, res) {
  try {
    const tenant = await tenantsService.createTenantService(req.body);
    res.status(201).json(tenant);
  } catch (err) {
    console.error("createTenant:", err);
    res.status(err.status || 500).json({ message: err.message || "Server error creating tenant" });
  }
}

async function getTenants(req, res) {
  try {
    const tenants = await tenantsService.listTenantsService();
    res.json(tenants);
  } catch (err) {
    console.error("getTenants:", err);
    res.status(500).json({ message: "Error fetching tenants" });
  }
}

async function getTenantById(req, res) {
  try {
    const tenant = await tenantsService.getTenantByIdService(req.params.id);
    res.json(tenant);
  } catch (err) {
    console.error("getTenantById:", err);
    res.status(err.status || 500).json({ message: err.message || "Error fetching tenant" });
  }
}

module.exports = {
  createTenant,
  getTenants,
  getTenantById,
};
