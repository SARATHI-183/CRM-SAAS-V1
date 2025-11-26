// run-tenant-seeds.js
require("dotenv").config();
const { knex } = require("./src/database/knex"); 
const path = require("path");

async function run() {
  try {
    const tenantId = process.argv[2]; // pass tenant id as argument
    if (!tenantId) {
      console.error("❌ Tenant ID required. Usage:");
      console.error("   node run-tenant-seeds.js <tenantId>");
      process.exit(1);
    }

    const schemaName = `tenant_${tenantId.replace(/-/g, "_")}`;

    // Load tenant seeds from directory
    const seedsDir = path.join(__dirname, "src/database/seeders/tenant-seeds");
    const seedFile = path.join(seedsDir, "002_tenant_seed.js");

    const seedFn = require(seedFile);

    console.log("⚡ Running tenant seed for schema:", schemaName);
    await seedFn(schemaName);

    console.log("✅ Tenant seed completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error running tenant seed:");
    console.error(err);
    process.exit(1);
  }
}

run();
