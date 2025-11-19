const express = require("express");
const ctrl = require("../controllers/rolesController");

const router = express.Router();

// All roles routes require authentication
router.get("/", ctrl.listRoles);
router.get("/:id", ctrl.getRole);
router.post("/", ctrl.createRole);
router.delete("/:id", ctrl.deleteRole);

module.exports = router;
