const express = require("express");
const db = require("../db/connection");
const auth = require("../middlewares/auth");

const router = express.Router();

// Get modules for tenant (core + tenant-specific)
router.get("/:tenant_id", auth, async (req, res) => {
  try {
    const { tenant_id } = req.params;
    const modules = await db("modules")
      .where("is_core", true)
      .orWhere("tenant_id", tenant_id)
      .select("*");
    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching modules" });
  }
});

module.exports = router;
