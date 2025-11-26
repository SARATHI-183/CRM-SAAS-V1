const { knex: masterKnex, tenantKnex } = require('../../database/knex');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../database/knex').knex;
const bcrypt = require('bcrypt');

async function findSuperAdminByEmail(email) {
  return knex('super_admins')
    .where('email', email)
    .first();
}

async function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

async function createTenant({ company_name, company_email, subscription_plan = 'free' }) {
  if (!company_name || !company_email)
    throw new Error('company_name and company_email are required');

  const tenantId = uuidv4();
  const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`;

  let tenantRow;

  try {
    // 1️⃣ Insert tenant row in master DB
    [tenantRow] = await masterKnex('tenants')
      .insert({
        id: tenantId,
        company_name,
        company_email,
        db_schema: schemaName,
        subscription_plan,
        is_active: true,
        activated_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    console.log(`Tenant created in master DB: ${tenantRow.company_name}`);

    // 2️⃣ Create tenant schema
    await masterKnex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    console.log(`Schema created: ${schemaName}`);

    // 3️⃣ Run tenant migrations (core + custom module tables)
    const tk = tenantKnex(schemaName);
    try {
      await tk.migrate.latest(); // creates all tenant tables
      console.log(`Tenant migrations completed for schema: ${schemaName}`);
    } finally {
      await tk.destroy();
    }

    // 4️⃣ Log migration in master DB
    await masterKnex('tenant_migration_log').insert({
      tenant_id: tenantRow.id,
      migration_name: `migrated_${schemaName}`,
      ran_at: new Date()
    });

    return {
      tenant_id: tenantRow.id,
      db_schema: schemaName,
      company_name: tenantRow.company_name
    };

  } catch (err) {
    console.error('Tenant creation failed:', err);

    // Rollback: drop tenant schema & delete master row
    try { await masterKnex.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`); } catch {}
    try { await masterKnex('tenants').where({ id: tenantRow?.id }).del(); } catch {}

    throw err;
  }
}

// async function createTenantUser(tenantId, { full_name, email, password, role }) {
//   if (!full_name || !email || !password)
//     throw new Error("full_name, email, password are required");

//   // 1️⃣ Find tenant in master DB
//   const tenant = await masterKnex("tenants").where("id", tenantId).first();
//   if (!tenant) throw new Error("Tenant not found");

//   const schema = tenant.db_schema;
//   const tk = tenantKnex(schema);

//   // 2️⃣ Check existing user
//   const exists = await tk("users").where("email", email).first();
//   if (exists) throw new Error("User already exists in this tenant");

//   // 3️⃣ Hash password
//   const password_hash = await bcrypt.hash(password, 10);

//   // 4️⃣ Insert into tenant.users table
//   const [user] = await tk("users")
//     .insert({
//       full_name,
//       email,
//       role: role || "tenant_admin",
//       password_hash,
//       created_at: new Date(),
//       updated_at: new Date()
//     })
//     .returning(["id", "full_name", "email", "role"]);

//   return user;
// }

module.exports = { 
  findSuperAdminByEmail,
  validatePassword,
  createTenant,
  // createTenantUser
};
