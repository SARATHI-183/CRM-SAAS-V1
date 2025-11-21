// // src/routes/superadmin/modules.js
// const express = require("express");
// const router = express.Router();
// const db = require("../../db/connection");
// const auth = require("../../middlewares/auth");

// // middleware that ensures super admin role (role_id=1)
// function ensureSuperAdmin(req, res, next) {
//   if (req.user.role_id !== 1) return res.status(403).json({ message: "Forbidden" });
//   next();
// }

// router.use(ensureSuperAdmin);

// // GET all modules (global + tenant custom)
// router.get("/:tenant_id", async (req, res) => {
//   try {
//     const { tenant_id } = req.params;

//     // core modules (is_core true)
//     const core = await db("modules").where({ is_core: true }).select("*");

//     // tenant-specific modules
//     const tenantCustom = await db("custom_modules").where({ tenant_id }).select("*");

//     res.json({ core, tenantCustom });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST create custom module for tenant
// router.post("/:tenant_id", async (req, res) => {
//   try {
//     const { tenant_id } = req.params;
//     const { module_key, name, config } = req.body;
//     const [m] = await db("custom_modules").insert({ tenant_id, module_key, name, config }).returning("*");
//     res.status(201).json(m);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST add custom field to a custom module
// router.post("/:tenant_id/:module_id/fields", async (req, res) => {
//   try {
//     const { module_id } = req.params;
//     const { field_key, label, field_type, is_required, meta } = req.body;
//     const [f] = await db("custom_fields").insert({ module_id, field_key, label, field_type, is_required, meta }).returning("*");
//     res.status(201).json(f);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // PATCH toggle enable/disable custom module
// router.patch("/:tenant_id/:module_id/toggle", async (req, res) => {
//   try {
//     const { module_id } = req.params;
//     const module = await db("custom_modules").where({ id: module_id }).first();
//     if (!module) return res.status(404).json({ message: "Module not found" });
//     const [m] = await db("custom_modules").where({ id: module_id }).update({ is_enabled: !module.is_enabled, updated_at: new Date() }).returning("*");
//     res.json(m);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const auth = require("../../middlewares/auth");
const { validate: isUuid } = require("uuid");

// middleware that ensures super admin role (role_id=1)
function ensureSuperAdmin(req, res, next) {
  if (req.user.role_id !== 1) return res.status(403).json({ message: "Forbidden" });
  next();
}

router.use(ensureSuperAdmin);

// GET all modules (core + tenant custom)
router.get("/:tenant_id", async (req, res) => {
  try {
    const { tenant_id } = req.params;
    if (!isUuid(tenant_id)) return res.status(400).json({ message: "Invalid tenant_id" });

    // core modules (is_core true)
    const core = await db("modules").where({ is_core: true }).select("*");

    // tenant-specific custom modules
    const tenantCustom = await db("custom_modules")
      .where({ tenant_id })
      .select("*");

    res.json({ core, tenantCustom });
  } catch (err) {
    console.error("GET /modules/:tenant_id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create custom module for tenant
router.post("/:tenant_id", async (req, res) => {
  try {
    const { tenant_id } = req.params;
    if (!isUuid(tenant_id)) return res.status(400).json({ message: "Invalid tenant_id" });

    const { module_key, name, config } = req.body;
    if (!module_key || !name) return res.status(400).json({ message: "module_key and name are required" });

    const [m] = await db("custom_modules")
      .insert({ tenant_id, module_key, name, config, is_enabled: true })
      .returning("*");

    res.status(201).json(m);
  } catch (err) {
    console.error("POST /modules/:tenant_id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST add custom field to a custom module
router.post("/:tenant_id/:module_id/fields", async (req, res) => {
  try {
    const { module_id } = req.params;
    if (!isUuid(module_id)) return res.status(400).json({ message: "Invalid module_id" });

    const { field_key, label, field_type, is_required = false, meta = null } = req.body;
    if (!field_key || !label || !field_type) {
      return res.status(400).json({ message: "field_key, label, and field_type are required" });
    }

    // Check if module exists
    const moduleExists = await db("custom_modules").where({ id: module_id }).first();
    if (!moduleExists) return res.status(404).json({ message: "Module not found" });

    const [f] = await db("custom_fields")
      .insert({ module_id, field_key, label, field_type, is_required, meta })
      .returning("*");

    res.status(201).json(f);
  } catch (err) {
    console.error("POST /modules/:tenant_id/:module_id/fields:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH toggle enable/disable custom module
router.patch("/:tenant_id/:module_id/toggle", async (req, res) => {
  try {
    const { module_id } = req.params;
    if (!isUuid(module_id)) return res.status(400).json({ message: "Invalid module_id" });

    const module = await db("custom_modules").where({ id: module_id }).first();
    if (!module) return res.status(404).json({ message: "Module not found" });

    const [m] = await db("custom_modules")
      .where({ id: module_id })
      .update({ is_enabled: !module.is_enabled, updated_at: new Date() })
      .returning("*");

    res.json(m);
  } catch (err) {
    console.error("PATCH /modules/:tenant_id/:module_id/toggle:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
