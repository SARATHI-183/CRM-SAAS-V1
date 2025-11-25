// // src/database/knex.js
// const Knex = require('knex');
// const knexfile = require('../../knexfile');

// const env = process.env.NODE_ENV || 'development';
// const knex = Knex(knexfile[env]);

// /**
//  * Create a Knex instance targeted at a tenant schema
//  * Use this when running tenant migrations and when handling requests for a tenant.
//  */
// function tenantKnex(schema) {
//   if (!schema) throw new Error('schema required for tenantKnex');
//   return Knex(knexfile.tenant(schema));
// }

// module.exports = { knex, tenantKnex };


// // src/database/knex.js
// const Knex = require('knex');
// const knexfile = require('../../knexfile');

// // Current environment (default: development)
// const ENV = process.env.NODE_ENV || 'development';

// // Master DB connection (used for tenants table, modules table, etc.)
// const masterKnex = Knex(knexfile[ENV]);

// /**
//  * Create and return a Knex instance bound to a specific tenant schema.
//  * Used for:
//  *  - running tenant migrations
//  *  - handling API requests for that tenant
//  */
// function tenantKnex(schemaName) {
//   if (!schemaName) {
//     throw new Error('tenantKnex(schemaName) → schemaName is required.');
//   }

//   // Generates a dynamic config from knexfile.tenant(schemaName)
//   const config = knexfile.tenant(schemaName);

//   return Knex({
//     ...config,
//     // **Ensures search_path = tenant_schema, public**
//     searchPath: [schemaName, 'public']
//   });
// }

// module.exports = {
//   knex: masterKnex,
//   tenantKnex
// };

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
