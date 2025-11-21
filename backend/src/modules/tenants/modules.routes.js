const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/auth");
const { getModules } = require("./modules.controller");

// All tenant routes require auth
router.use(authMiddleware);

// GET all modules for tenant
router.get("/", getModules);

module.exports = router;
