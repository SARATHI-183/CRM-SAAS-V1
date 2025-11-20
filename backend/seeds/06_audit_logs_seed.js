const crypto = require('crypto');

exports.seed = async function(knex) {
  // Delete existing audit logs
  await knex('audit_logs').del();

  // Fetch a tenant
  const tenant = await knex('tenants').first('id');
  if (!tenant) {
    throw new Error('No tenant found. Please seed tenants first.');
  }
  const tenantId = tenant.id;

  // Fetch a user for this tenant
  const user = await knex('users').where({ tenant_id: tenantId }).first('id');

  // Example modules and record IDs (replace with your actual module IDs and record references)
  const modules = [
    'aaa11111-1111-1111-1111-111111111111', // onboarding
    'bbb22222-2222-2222-2222-222222222222', // enquiry
    'ccc33333-3333-3333-3333-333333333333', // leads
    'ddd44444-4444-4444-4444-444444444444', // quotation
    'eee55555-5555-5555-5555-555555555555'  // payments
  ];

  const actions = ['created', 'updated', 'deleted', 'approved'];

  const auditLogs = [];

  modules.forEach((moduleId, idx) => {
    actions.forEach(action => {
      auditLogs.push({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        module_id: moduleId,
        record_id: crypto.randomUUID(), // simulate some record ID
        user_id: user ? user.id : null,
        action,
        old_value: JSON.stringify({ field1: 'old_value', field2: 'old_value' }),
        new_value: JSON.stringify({ field1: 'new_value', field2: 'new_value' }),
        timestamp: new Date()
      });
    });
  });

  // Insert into audit_logs table
  await knex('audit_logs').insert(auditLogs);
};
