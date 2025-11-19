// src/controllers/modulesController.js
const db = require("../db/connection");

async function getModules(req, res) {
  try {
    const { tenant_id } = req.params;

    // core modules
    const core = await db("modules")
      .where({ is_core: true })
      .select("id", "module_name", "description", "is_core");

    // tenant custom modules
    const custom = await db("custom_modules")
      .where({ tenant_id, is_enabled: true })
      .select("id", "module_key", "name", "config");

    res.json({ core, custom });
  } catch (err) {
    console.error("getModules:", err);
    res.status(500).json({ message: "Error fetching modules" });
  }
}

module.exports = { getModules };
