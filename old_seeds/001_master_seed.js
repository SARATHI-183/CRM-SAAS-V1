

const bcrypt = require('bcrypt');
const { knex } = require('../../knex');
const { v4: uuidv4 } = require('uuid');

exports.seed = async function () {
  // ---------------------------
  // DELETE DEPENDENT TABLES FIRST (FK safe order)
  // ---------------------------
  await knex('tenant_modules').del();
  await knex('modules').del();
  await knex('super_admins').del();
  await knex('tenants').del();

  // ---------------------------
  // SUPER ADMINS
  // ---------------------------
  const passwordPlain = 'Admin@123';
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  const superAdmins = [
    {
      id: uuidv4(),
      full_name: 'Platform Admin',
      email: 'admin@crm.com',
      password_hash: passwordHash,
      role: 'superadmin',
      is_active: true,
      meta: {},
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await knex('super_admins').insert(superAdmins);

  // ---------------------------
  // MODULES
  // ---------------------------
  const modules = [
    { name: 'Dashboard', key: 'dashboard', is_core: true },
    { name: 'Leads', key: 'leads', is_core: true },
    { name: 'Customers', key: 'customers', is_core: true },
    { name: 'Quotes', key: 'quotes', is_core: true },
    { name: 'Invoices', key: 'invoices', is_core: true },
    { name: 'Activities', key: 'activities', is_core: true },
    { name: 'Offers', key: 'offers', is_core: false },
    { name: 'Orders', key: 'orders', is_core: true },
    { name: 'Payments', key: 'payments', is_core: true },
    { name: 'Settings', key: 'settings', is_core: true },
  ].map((m) => ({
    id: uuidv4(),
    name: m.name,
    key: m.key,
    is_core: m.is_core,
    is_premium: false,
    meta: {},
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await knex('modules').insert(modules);

  // ---------------------------
  // TENANTS
  // ---------------------------
  const defaultTenantId = uuidv4();
  const tenants = [
    {
      id: defaultTenantId,
      company_name: 'Default Company',
      company_email: 'company@example.com',
      db_schema: `tenant_${defaultTenantId.replace(/-/g, '_')}`,
      subscription_plan: 'free',
      is_active: true,
      activated_at: new Date(),
      deactivated_at: null,
      settings: {},
      billing_info: {},
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await knex('tenants').insert(tenants);

  // ---------------------------
  // TENANT MODULES
  // ---------------------------
  const tenantModules = modules.map((m) => ({
    id: uuidv4(),
    tenant_id: defaultTenantId,
    module_id: m.id,
    is_enabled: true,
    config: {},
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await knex('tenant_modules').insert(tenantModules);

  console.log('Full master seed completed');

  const roles = [
    { id: uuidv4(), name: 'Superadmin', created_at: new Date(), updated_at: new Date() },
    { id: uuidv4(), name: 'Admin', created_at: new Date(), updated_at: new Date() },
    { id: uuidv4(), name: 'Sales', created_at: new Date(), updated_at: new Date() },
    { id: uuidv4(), name: 'Manager', created_at: new Date(), updated_at: new Date() },
  ];

  await knex('roles').del();
  await knex('roles').insert(roles);

};
