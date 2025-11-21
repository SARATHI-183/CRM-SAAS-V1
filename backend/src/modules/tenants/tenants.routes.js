// src/routes/tenants.routes.js
const express = require("express");
const router = express.Router();
const tenantsController = require("./tenants.controller");



// Create a tenant (Super Admin only)
router.post("/", tenantsController.createTenant);

// Get all tenants
router.get("/", tenantsController.getTenants);

// Get tenant by ID
router.get("/:id", tenantsController.getTenantById);

module.exports = router;
