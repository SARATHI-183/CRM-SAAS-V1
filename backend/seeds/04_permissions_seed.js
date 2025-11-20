const crypto = require('crypto');

exports.seed = async function(knex) {
  // Delete existing permissions
  await knex('permissions').del();

  // Fetch tenant ID dynamically
  const tenant = await knex('tenants').first('id');
  if (!tenant) {
    throw new Error('No tenant found. Please seed tenants first.');
  }
  const tenantId = tenant.id;

  // Define modules (example modules)
  const modules = [
    { id: crypto.randomUUID(), name: 'onboarding' },
    { id: crypto.randomUUID(), name: 'enquiry' },
    { id: crypto.randomUUID(), name: 'leads' },
    { id: crypto.randomUUID(), name: 'quotation' },
    { id: crypto.randomUUID(), name: 'payments' },
    { id: crypto.randomUUID(), name: 'delivery' }
  ];

  // Define actions
  const actions = ['create', 'read', 'update', 'delete', 'approve', 'export'];

  // Build permissions array
  const permissions = [];
  modules.forEach((module) => {
    actions.forEach((action) => {
      permissions.push({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        module_id: module.id,
        action,
        created_at: new Date(),
        updated_at: new Date()
      });
    });
  });

  // Insert into permissions table
  await knex('permissions').insert(permissions);
};
