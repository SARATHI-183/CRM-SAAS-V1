// src/routes/roles.routes.js
const express = require("express");
const router = express.Router();
const rolesController = require("./roles.controller");


// GET all roles
router.get("/", rolesController.listRoles);

// GET single role by ID
router.get("/:id", rolesController.getRole);

// CREATE role
router.post("/", rolesController.createRole);

// DELETE role
router.delete("/:id", rolesController.deleteRole);

module.exports = router;
