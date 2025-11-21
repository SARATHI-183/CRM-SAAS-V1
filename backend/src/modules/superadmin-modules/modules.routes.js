const express = require("express");
const router = express.Router();
const { ensureSuperAdmin } = require("../../middlewares/auth");
const modulesController = require("./modules.controller");

// All superadmin routes require superadmin check
router.use(ensureSuperAdmin);

// List modules for a tenant
router.get("/", modulesController.listModules);

// Create custom module for tenant
router.post("/", modulesController.createCustomModule);

// Add custom field to a module
router.post("/:module_id/fields", modulesController.addCustomField);

// Toggle enable/disable module
router.patch("/:module_id/toggle", modulesController.toggleModule);

module.exports = router;
