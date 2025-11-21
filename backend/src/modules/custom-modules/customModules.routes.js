const router = require("express").Router();
const controller = require("./customModules.controller");
const { validateCreateModule } = require("./customModules.validator");

// Create new custom module
router.post("/", validateCreateModule, controller.createModule);

// Get all modules for a tenant
router.get("/:tenant_id", controller.getModules);

// Get single module
router.get("/single/:module_id", controller.getModuleById);

// Update module
router.put("/:module_id", controller.updateModule);

// Delete module
router.delete("/:module_id", controller.deleteModule);

module.exports = router;
