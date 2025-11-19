const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/moduleController");

// GET /api/v1/modules/:tenant_id
router.get("/:tenant_id", ctrl.getModules);

module.exports = router;
