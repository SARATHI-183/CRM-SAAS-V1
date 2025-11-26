
// src/database/knex.js
const Knex = require('knex');
const knexfile = require('../../knexfile');

// Current environment (default: development)
const ENV = process.env.NODE_ENV || 'development';

// Master DB connection (used for tenants table, modules table, etc.)
const masterKnex = Knex(knexfile[ENV]);

/**
 * Create and return a Knex instance bound to a specific tenant schema.
 */
function tenantKnex(schemaName) {
  if (!schemaName) {
    throw new Error('tenantKnex(schemaName) → schemaName is required.');
  }

  // Use the new factory name
  const config = knexfile.tenantConfig(schemaName);

  return Knex(config);
}

module.exports = {
  knex: masterKnex,
  tenantKnex
};
