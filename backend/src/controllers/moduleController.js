// const db = require("../db/connection");
// const { validate: isUuid } = require("uuid");

// async function getModules(req, res) {
//   try {
//     const { tenant_id } = req.params;

//     // Validate UUID
//     if (!isUuid(tenant_id)) {
//       return res.status(400).json({ message: "Invalid tenant ID" });
//     }

//     // Core modules (shared across all tenants)
//     const core = await db("modules")
//       .where({ is_core: true })
//       .select("id", "module_name", "description", "is_core");

//     // Tenant custom modules
//     const custom = await db("custom_modules")
//       .where({ tenant_id, is_enabled: true })
//       .select("id", "module_key", "name", "config");

//     res.json({ core, custom });
//   } catch (err) {
//     console.error("getModules:", err);
//     res.status(500).json({ message: "Error fetching modules" });
//   }
// }

// module.exports = { getModules };

// const db = require("../db/connection");
// const { validate: isUuid } = require("uuid");

// async function getModules(req, res) {
//   try {
//     const { tenant_id } = req.params;

//     if (!isUuid(tenant_id)) {
//       return res.status(400).json({ message: "Invalid tenant ID" });
//     }

//     // 1. Core modules
//     const core = await db("modules")
//       .where({ is_core: true })
//       .select("id", "module_key", "module_name", "description", "is_core");

//     // 2. Tenant-specific custom modules
//     const custom = await db("custom_modules")
//       .where({ tenant_id, is_enabled: true })
//       .select("id", "module_key", "name", "config", "tenant_id");

//     // 3. Global custom module templates
//     const templates = await db("custom_modules")
//       .whereNull("tenant_id")
//       .select("id", "module_key", "name", "config");

//     res.json({ core, custom, templates });

//   } catch (err) {
//     console.error("getModules:", err);
//     res.status(500).json({ message: "Error fetching modules" });
//   }
// }

// module.exports = { getModules };


// const db = require("../db/connection");
// const { validate: isUuid } = require("uuid");

// async function getModules(req, res) {
//   try {
//     const { tenant_id } = req.params;

//     // Validate UUID
//     if (!isUuid(tenant_id)) {
//       return res.status(400).json({ message: "Invalid tenant ID" });
//     }

//     // CORE modules
//     const core = await db("modules")
//       .where({ is_core: true })
//       .select("id", "module_key", "module_name", "description", "is_core");

//     // CUSTOM modules for this tenant
//     const custom = await db("custom_modules")
//       .where({ tenant_id, is_enabled: true })
//       .select("id", "module_key", "name", "config");

//     return res.json({ core, custom });
//   } catch (err) {
//     console.error("getModules:", err);
//     res.status(500).json({ message: "Error fetching modules" });
//   }
// }

// module.exports = { getModules };

const db = require("../db/connection");

async function getModules(req, res) {
  try {
    // Tenant ID comes from JWT or tenant middleware
    const tenant_id = req.user?.tenant_id;

    // Fetch core modules
    const core = await db("modules")
      .where({ is_core: true })
      .select("id", "module_key", "module_name", "description", "is_core");

    // If this is super admin → no tenant_id
    if (!tenant_id) {
      return res.json({ core, custom: [] });
    }

    // Fetch tenant custom modules
    const custom = await db("custom_modules")
      .where({ tenant_id, is_enabled: true })
      .select("id", "module_key", "name", "config");

    return res.json({ core, custom });

  } catch (err) {
    console.error("getModules:", err);
    return res.status(500).json({ message: "Error fetching modules" });
  }
}

module.exports = { getModules };
