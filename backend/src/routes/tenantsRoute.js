const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tenantsController");

router.post("/", ctrl.createTenant);
router.get("/", ctrl.getTenants);
router.get("/:id", ctrl.getTenantById);

module.exports = router;
