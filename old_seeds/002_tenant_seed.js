// const { knex, tenantKnex } = require('../knex');
// const bcrypt = require('bcrypt');
// const { v4: uuidv4 } = require('uuid');

// exports.seed = async function() {
//   // ----------------------------
//   // 1. Create a test tenant
//   // ----------------------------
//   const tenantId = uuidv4();
//   const schemaName = 'tenant_demo';

//   await knex('tenants').insert({
//     id: tenantId,
//     company_name: 'Demo Company',
//     company_email: 'demo@example.com',
//     db_schema: schemaName,
//     subscription_plan: 'free',
//     is_active: true,
//     settings: {},
//     billing_info: {}
//   });

//   // ----------------------------
//   // 2. Create tenant schema
//   // ----------------------------
//   await knex.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [schemaName]);

//   const tk = tenantKnex(schemaName);

//   try {
//     // ----------------------------
//     // 3. Roles
//     // ----------------------------
//     await tk('roles').del();
//     const roles = [
//       { id: 1, name: 'Admin' },
//       { id: 2, name: 'Sales' },
//       { id: 3, name: 'Manager' }
//     ];
//     await tk('roles').insert(roles);

//     // ----------------------------
//     // 4. Users
//     // ----------------------------
//     await tk('users').del();
//     const passwordHash = await bcrypt.hash('TenantUser@123', 10);
//     const users = [
//       {
//         id: uuidv4(),
//         full_name: 'Demo Admin',
//         email: 'admin@demo.com',
//         password_hash: passwordHash,
//         is_active: true
//       }
//     ];
//     await tk('users').insert(users);

//     // ----------------------------
//     // 5. Assign roles
//     // ----------------------------
//     await tk('user_roles').del();
//     await tk('user_roles').insert([
//       { id: uuidv4(), user_id: users[0].id, role_id: 1 } // Admin
//     ]);

//     // ----------------------------
//     // 6. Assign modules
//     // ----------------------------
//     const modules = await knex('modules');
//     const tenantModules = modules.map(m => ({
//       id: uuidv4(),
//       tenant_id: tenantId,
//       module_id: m.id,
//       is_enabled: true,
//       config: {}
//     }));
//     await tk('tenant_modules').del();
//     await tk('tenant_modules').insert(tenantModules);

//     console.log('✅ Tenant seed completed: Demo tenant, roles, users, modules');
//   } finally {
//     await tk.destroy();
//   }
// };



// const bcrypt = require('bcrypt');
// const { knex } = require('../../knex');
// const { v4: uuidv4 } = require('uuid');

// exports.seed = async function () {
//   // ---------------------------
//   // ROLES
//   // ---------------------------
//   const roles = [
//     { name: 'Admin' },
//     { name: 'Sales' },
//     { name: 'Manager' },
//   ].map((r) => ({
//     id: null, // let DB auto increment
//     name: r.name,
//     created_at: new Date(),
//     updated_at: new Date(),
//   }));

//   await knex('roles').del();
//   const insertedRoles = await knex('roles').insert(roles).returning('*');

//   // ---------------------------
//   // USERS
//   // ---------------------------
//   const passwordPlain = 'User@123';
//   const passwordHash = await bcrypt.hash(passwordPlain, 10);

//   const users = [
//     {
//       id: uuidv4(),
//       full_name: 'Tenant Admin',
//       email: 'admin@tenant.com',
//       password_hash: passwordHash,
//       is_active: true,
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//     {
//       id: uuidv4(),
//       full_name: 'Sales User',
//       email: 'sales@tenant.com',
//       password_hash: passwordHash,
//       is_active: true,
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   ];

//   await knex('users').del();
//   await knex('users').insert(users);

//   // ---------------------------
//   // USER_ROLES
//   // ---------------------------
//   const userRoles = [
//     { user_id: users[0].id, role_id: insertedRoles.find(r => r.name === 'Admin').id },
//     { user_id: users[1].id, role_id: insertedRoles.find(r => r.name === 'Sales').id },
//   ].map((ur) => ({
//     id: uuidv4(),
//     ...ur,
//     created_at: new Date(),
//     updated_at: new Date(),
//   }));

//   await knex('user_roles').del();
//   await knex('user_roles').insert(userRoles);

//   // ---------------------------
//   // CONTACTS
//   // ---------------------------
//   const contacts = [
//     {
//       id: uuidv4(),
//       first_name: 'John',
//       last_name: 'Doe',
//       email: 'john.doe@example.com',
//       phone: '1234567890',
//       company_name: 'Example Corp',
//       job_title: 'Manager',
//       address: { city: 'New York', country: 'USA' },
//       is_deleted: false,
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   ];

//   await knex('contacts').del();
//   await knex('contacts').insert(contacts);

//   // ---------------------------
//   // LEADS
//   // ---------------------------
//   const leads = [
//     {
//       id: uuidv4(),
//       title: 'Website Inquiry',
//       status: 'new',
//       source: 'Website',
//       contact_id: contacts[0].id,
//       assigned_to: users[1].id,
//       lead_score: 10,
//       meta: {},
//       is_deleted: false,
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   ];

//   await knex('leads').del();
//   await knex('leads').insert(leads);

//   // ---------------------------
//   // DEALS
//   // ---------------------------
//   const deals = [
//     {
//       id: uuidv4(),
//       title: 'Big Deal Opportunity',
//       amount: 5000,
//       stage: 'prospect',
//       contact_id: contacts[0].id,
//       assigned_to: users[1].id,
//       meta: {},
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   ];

//   await knex('deals').del();
//   await knex('deals').insert(deals);

//   // ---------------------------
//   // ACTIVITIES
//   // ---------------------------
//   const activities = [
//     {
//       id: uuidv4(),
//       module: 'leads',
//       module_id: leads[0].id,
//       type: 'call',
//       content: 'Follow-up call scheduled',
//       created_by: users[1].id,
//       meta: {},
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   ];

//   await knex('activities').del();
//   await knex('activities').insert(activities);

//   // ---------------------------
//   // CUSTOM FIELDS
//   // ---------------------------
//   const customFields = [
//     {
//       id: uuidv4(),
//       module_key: 'leads',
//       field_key: 'budget',
//       label: 'Budget',
//       type: 'number',
//       options: [],
//       is_required: false,
//       meta: { placeholder: 'Enter budget' },
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   ];

//   await knex('custom_fields').del();
//   await knex('custom_fields').insert(customFields);

//   // ---------------------------
//   // CUSTOM MODULE DATA
//   // ---------------------------
//   const customModuleData = [
//     {
//       id: uuidv4(),
//       module_key: 'leads',
//       data: { budget: 10000 },
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   ];

//   await knex('custom_module_data').del();
//   await knex('custom_module_data').insert(customModuleData);

//   // ---------------------------
//   // AUDIT LOGS (empty initially)
//   // ---------------------------
//   await knex('audit_logs').del();

//   console.log('Full tenant seed completed');
// };



// const bcrypt = require('bcrypt');
// const { knex } = require('../../knex');
// const { v4: uuidv4 } = require('uuid');

// async function runTenantSeed(tenantData) {
// // ---------------------------
// // CONFIG
// // ---------------------------
// const tenantId = tenantData.id || uuidv4();
// const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`;

// // 1️⃣ Create schema if not exists
// await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);

// // 2️⃣ Create tenant-specific knex instance
// const tenantKnex = require('knex')({
// client: 'pg',
// connection: knex.client.config.connection,
// searchPath: [schemaName, 'public'],
// });

// // ---------------------------
// // DELETE TABLE DATA (safe FK order)
// // ---------------------------
// const tables = ['user_roles', 'users', 'roles', 'contacts', 'leads', 'deals', 'activities', 'custom_module_data', 'custom_fields', 'audit_logs'];
// for (const t of tables) {
// await tenantKnex(t).del().catch(() => {}); // skip if table doesn't exist
// }

// // ---------------------------
// // ROLES
// // ---------------------------
// const roles = [
// { id: uuidv4(), name: 'Admin', created_at: new Date(), updated_at: new Date() },
// { id: uuidv4(), name: 'Sales', created_at: new Date(), updated_at: new Date() },
// { id: uuidv4(), name: 'Manager', created_at: new Date(), updated_at: new Date() },
// ];
// await tenantKnex('roles').insert(roles);

// // ---------------------------
// // USERS
// // ---------------------------
// const passwordPlain = 'Tenant@123';
// const passwordHash = await bcrypt.hash(passwordPlain, 10);

// const users = [
// {
// id: uuidv4(),
// full_name: 'Tenant Admin',
// email: '[admin@tenant.com](mailto:admin@tenant.com)',
// password_hash: passwordHash,
// is_active: true,
// created_at: new Date(),
// updated_at: new Date(),
// },
// {
// id: uuidv4(),
// full_name: 'Sales User',
// email: '[sales@tenant.com](mailto:sales@tenant.com)',
// password_hash: passwordHash,
// is_active: true,
// created_at: new Date(),
// updated_at: new Date(),
// },
// ];
// await tenantKnex('users').insert(users);

// // ---------------------------
// // USER ROLES
// // ---------------------------
// const userRoles = [
// { user_id: users[0].id, role_id: roles.find(r => r.name === 'Admin').id },
// { user_id: users[1].id, role_id: roles.find(r => r.name === 'Sales').id },
// ].map((ur) => ({ id: uuidv4(), ...ur, created_at: new Date(), updated_at: new Date() }));

// await tenantKnex('user_roles').insert(userRoles);

// // ---------------------------
// // CONTACTS
// // ---------------------------
// const contacts = [
// {
// id: uuidv4(),
// first_name: 'John',
// last_name: 'Doe',
// email: '[john.doe@example.com](mailto:john.doe@example.com)',
// phone: '1234567890',
// company_name: 'Example Corp',
// job_title: 'Manager',
// address: { city: 'New York', country: 'USA' },
// is_deleted: false,
// created_at: new Date(),
// updated_at: new Date(),
// },
// ];
// await tenantKnex('contacts').insert(contacts);

// // ---------------------------
// // LEADS
// // ---------------------------
// const leads = [
// {
// id: uuidv4(),
// title: 'Website Inquiry',
// status: 'new',
// source: 'Website',
// contact_id: contacts[0].id,
// assigned_to: users[1].id,
// lead_score: 10,
// meta: {},
// is_deleted: false,
// created_at: new Date(),
// updated_at: new Date(),
// },
// ];
// await tenantKnex('leads').insert(leads);

// // ---------------------------
// // DEALS
// // ---------------------------
// const deals = [
// {
// id: uuidv4(),
// title: 'Big Deal Opportunity',
// amount: 5000,
// stage: 'prospect',
// contact_id: contacts[0].id,
// assigned_to: users[1].id,
// meta: {},
// created_at: new Date(),
// updated_at: new Date(),
// },
// ];
// await tenantKnex('deals').insert(deals);

// // ---------------------------
// // ACTIVITIES
// // ---------------------------
// const activities = [
// {
// id: uuidv4(),
// module: 'leads',
// module_id: leads[0].id,
// type: 'call',
// content: 'Follow-up call scheduled',
// created_by: users[1].id,
// meta: {},
// created_at: new Date(),
// updated_at: new Date(),
// },
// ];
// await tenantKnex('activities').insert(activities);

// // ---------------------------
// // CUSTOM FIELDS
// // ---------------------------
// const customFields = [
// {
// id: uuidv4(),
// module_key: 'leads',
// field_key: 'budget',
// label: 'Budget',
// type: 'number',
// options: [],
// is_required: false,
// meta: { placeholder: 'Enter budget' },
// created_at: new Date(),
// updated_at: new Date(),
// },
// ];
// await tenantKnex('custom_fields').insert(customFields);

// // ---------------------------
// // CUSTOM MODULE DATA
// // ---------------------------
// const customModuleData = [
// {
// id: uuidv4(),
// module_key: 'leads',
// data: { budget: 10000 },
// created_at: new Date(),
// updated_at: new Date(),
// },
// ];
// await tenantKnex('custom_module_data').insert(customModuleData);

// // ---------------------------
// // AUDIT LOGS (empty initially)
// // ---------------------------
// await tenantKnex('audit_logs').del();

// console.log(`Tenant seed completed for schema: ${schemaName}`);
// }

// // Export for Knex CLI compatibility
// exports.seed = async function () {
// // Provide default tenant data
// await runTenantSeed({ id: uuidv4(), company_name: 'Default Company' });
// };



const bcrypt = require("bcrypt");
const { knex } = require("../../knex");
const { v4: uuidv4 } = require("uuid");

// ------------------------------
// MAIN EXPORT (FOR CUSTOM RUNNER)
// ------------------------------
module.exports = async function (schemaName) {
  console.log("➡️  Seeding tenant schema:", schemaName);

  // Create tenant-specific knex instance
  const tenantKnex = require("knex")({
    client: "pg",
    connection: knex.client.config.connection,
    searchPath: [schemaName, "public"],
  });

  // ---------------------------
  // DELETE TABLE DATA
  // ---------------------------
  const tables = [
    "user_roles",
    "users",
    "roles",
    "contacts",
    "leads",
    "deals",
    "activities",
    "custom_module_data",
    "custom_fields",
    "audit_logs",
  ];

  for (const t of tables) {
    await tenantKnex(t).del().catch(() => {});
  }

  // ---------------------------
  // ROLES
  //---------------------------
  const roles = [
    { id: uuidv4(), name: "Admin", created_at: new Date(), updated_at: new Date() },
    { id: uuidv4(), name: "Sales", created_at: new Date(), updated_at: new Date() },
    { id: uuidv4(), name: "Manager", created_at: new Date(), updated_at: new Date() },
  ];

  await tenantKnex("roles").insert(roles);

  // ---------------------------
  // USERS
  //---------------------------
  const passwordHash = await bcrypt.hash("Tenant@123", 10);

  const users = [
    {
      id: uuidv4(),
      full_name: "Tenant Admin",
      email: "admin@tenant.com",
      password_hash: passwordHash,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      full_name: "Sales User",
      email: "sales@tenant.com",
      password_hash: passwordHash,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await tenantKnex("users").insert(users);

  // ---------------------------
  // USER ROLES
  //---------------------------
  const userRoles = [
    {
      id: uuidv4(),
      user_id: users[0].id,
      role_id: roles.find((r) => r.name === "Admin").id,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: users[1].id,
      role_id: roles.find((r) => r.name === "Sales").id,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await tenantKnex("user_roles").insert(userRoles);

  // ---------------------------
  // CONTACTS
  //---------------------------
  const contacts = [
    {
      id: uuidv4(),
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      company_name: "Example Corp",
      job_title: "Manager",
      address: { city: "New York", country: "USA" },
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await tenantKnex("contacts").insert(contacts);

  // ---------------------------
  // LEADS
  //---------------------------
  const leads = [
    {
      id: uuidv4(),
      title: "Website Inquiry",
      status: "new",
      source: "Website",
      contact_id: contacts[0].id,
      assigned_to: users[1].id,
      lead_score: 10,
      meta: {},
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await tenantKnex("leads").insert(leads);

  // ---------------------------
  // DEALS
  //---------------------------
  const deals = [
    {
      id: uuidv4(),
      title: "Big Deal Opportunity",
      amount: 5000,
      stage: "prospect",
      contact_id: contacts[0].id,
      assigned_to: users[1].id,
      meta: {},
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await tenantKnex("deals").insert(deals);

  // ---------------------------
  // ACTIVITIES
  //---------------------------
  const activities = [
    {
      id: uuidv4(),
      module: "leads",
      module_id: leads[0].id,
      type: "call",
      content: "Follow-up call scheduled",
      created_by: users[1].id,
      meta: {},
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await tenantKnex("activities").insert(activities);

  // ---------------------------
  // CUSTOM FIELDS
  //---------------------------
  const customFields = [
    {
      id: uuidv4(),
      module_key: "leads",
      field_key: "budget",
      label: "Budget",
      type: "number",
      options: [],
      is_required: false,
      meta: { placeholder: "Enter budget" },
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await tenantKnex("custom_fields").insert(customFields);

  // ---------------------------
  // CUSTOM MODULE DATA
  //---------------------------
  const customModuleData = [
    {
      id: uuidv4(),
      module_key: "leads",
      data: { budget: 10000 },
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  await tenantKnex("custom_module_data").insert(customModuleData);

  console.log(`✅ Tenant seed completed for schema: ${schemaName}`);
};

// ------------------------------------------------------
// OPTIONAL: Knex CLI fallback (not needed for your case)
// ------------------------------------------------------
exports.seed = async function () {
  console.log("⚠️  Knex CLI run detected — creating random tenant");
  const randomId = uuidv4();
  const schemaName = `tenant_${randomId.replace(/-/g, "_")}`;

  return module.exports(schemaName);
};
