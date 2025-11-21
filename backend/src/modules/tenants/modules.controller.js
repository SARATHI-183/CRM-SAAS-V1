const db = require("../../db/connection");

// GET all modules for tenant (core + enabled custom)
async function getModules(req, res) {
  try {
    const tenant_id = req.user.tenant_id;

    const core = await db("modules")
      .where({ is_core: true })
      .select("*");

    const custom = await db("custom_modules")
      .where({ tenant_id, is_enabled: true })
      .select("*");

    res.json({ core, custom });
  } catch (err) {
    console.error("getModules:", err);
    res.status(500).json({ message: "Error fetching modules" });
  }
}

module.exports = { getModules };
