// const db = require("../../db/connection");
// const { validate: isUuid } = require("uuid");

// // GET all modules for a tenant (core + tenant custom)
// async function getModulesByTenant(req, res) {
//   try {
//     const { tenant_id } = req.params;
//     if (!isUuid(tenant_id)) return res.status(400).json({ message: "Invalid tenant_id" });

//     const core = await db("modules").where({ is_core: true }).select("*");
//     const custom = await db("custom_modules").where({ tenant_id }).select("*");

//     res.json({ core, custom });
//   } catch (err) {
//     console.error("getModulesByTenant:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // CREATE a custom module for a tenant
// async function createModule(req, res) {
//   try {
//     const { tenant_id } = req.params;
//     if (!isUuid(tenant_id)) return res.status(400).json({ message: "Invalid tenant_id" });

//     const { module_key, name, config } = req.body;
//     if (!module_key || !name) return res.status(400).json({ message: "module_key and name required" });

//     const [module] = await db("custom_modules")
//       .insert({ tenant_id, module_key, name, config, is_enabled: true })
//       .returning("*");

//     res.status(201).json(module);
//   } catch (err) {
//     console.error("createModule:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // ADD a custom field to a module
// async function addField(req, res) {
//   try {
//     const { module_id } = req.params;
//     if (!isUuid(module_id)) return res.status(400).json({ message: "Invalid module_id" });

//     const { field_key, label, field_type, is_required = false, meta = null } = req.body;
//     if (!field_key || !label || !field_type)
//       return res.status(400).json({ message: "field_key, label, field_type required" });

//     const moduleExists = await db("custom_modules").where({ id: module_id }).first();
//     if (!moduleExists) return res.status(404).json({ message: "Module not found" });

//     const [field] = await db("custom_fields")
//       .insert({ module_id, field_key, label, field_type, is_required, meta })
//       .returning("*");

//     res.status(201).json(field);
//   } catch (err) {
//     console.error("addField:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // TOGGLE enable/disable custom module
// async function toggleModule(req, res) {
//   try {
//     const { module_id } = req.params;
//     if (!isUuid(module_id)) return res.status(400).json({ message: "Invalid module_id" });

//     const module = await db("custom_modules").where({ id: module_id }).first();
//     if (!module) return res.status(404).json({ message: "Module not found" });

//     const [updated] = await db("custom_modules")
//       .where({ id: module_id })
//       .update({ is_enabled: !module.is_enabled, updated_at: new Date() })
//       .returning("*");

//     res.json(updated);
//   } catch (err) {
//     console.error("toggleModule:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// module.exports = {
//   getModulesByTenant,
//   createModule,
//   addField,
//   toggleModule,
// };

const db = require("../../db/connection");
const { validate: isUuid } = require("uuid");

// GET all modules (core + tenant custom for a tenant)
async function listModules(req, res) {
  try {
    const { tenant_id } = req.query;
    if (!tenant_id || !isUuid(tenant_id)) {
      return res.status(400).json({ message: "Valid tenant_id required" });
    }

    const coreModules = await db("modules")
      .where({ is_core: true })
      .select("*");

    const tenantModules = await db("custom_modules")
      .where({ tenant_id })
      .select("*");

    res.json({ core: coreModules, tenantCustom: tenantModules });
  } catch (err) {
    console.error("listModules:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// CREATE custom module for tenant
async function createCustomModule(req, res) {
  try {
    const { tenant_id, module_key, name, config } = req.body;
    if (!tenant_id || !module_key || !name) {
      return res.status(400).json({ message: "tenant_id, module_key, and name are required" });
    }
    if (!isUuid(tenant_id)) return res.status(400).json({ message: "Invalid tenant_id" });

    const [module] = await db("custom_modules")
      .insert({ tenant_id, module_key, name, config, is_enabled: true })
      .returning("*");

    res.status(201).json(module);
  } catch (err) {
    console.error("createCustomModule:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ADD custom field to module
async function addCustomField(req, res) {
  try {
    const { module_id } = req.params;
    const { field_key, label, field_type, is_required = false, meta = null } = req.body;

    if (!module_id || !isUuid(module_id)) return res.status(400).json({ message: "Invalid module_id" });
    if (!field_key || !label || !field_type) {
      return res.status(400).json({ message: "field_key, label, and field_type are required" });
    }

    const moduleExists = await db("custom_modules").where({ id: module_id }).first();
    if (!moduleExists) return res.status(404).json({ message: "Module not found" });

    const [field] = await db("custom_fields")
      .insert({ module_id, field_key, label, field_type, is_required, meta })
      .returning("*");

    res.status(201).json(field);
  } catch (err) {
    console.error("addCustomField:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// TOGGLE enable/disable custom module
async function toggleModule(req, res) {
  try {
    const { module_id } = req.params;
    if (!module_id || !isUuid(module_id)) return res.status(400).json({ message: "Invalid module_id" });

    const module = await db("custom_modules").where({ id: module_id }).first();
    if (!module) return res.status(404).json({ message: "Module not found" });

    const [updated] = await db("custom_modules")
      .where({ id: module_id })
      .update({ is_enabled: !module.is_enabled, updated_at: new Date() })
      .returning("*");

    res.json(updated);
  } catch (err) {
    console.error("toggleModule:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listModules,
  createCustomModule,
  addCustomField,
  toggleModule,
};
