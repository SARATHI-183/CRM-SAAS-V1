// // knexfile.js
// require('dotenv').config();

// const common = {
//   client: 'pg',
//   pool: { min: 2, max: 10 },
//   migrations: {
//     // master migrations directory
//     directory: './src/database/master-migrations',
//     tableName: 'knex_master_migrations'
//   },
//   seeds: {
//     directory: './src/database/seeders'
//   }
// };

// module.exports = {
//   development: {
//     ...common,
//     connection: {
//       host: process.env.DB_HOST || '127.0.0.1',
//       port: Number(process.env.DB_PORT) || 5432,
//       user: process.env.DB_USER || 'postgres',
//       password: process.env.DB_PASS || 'yourpassword',
//       database: process.env.DB_NAME || 'crm_dev'
//     }
//   },
//   production: {
//     ...common,
//     connection: process.env.DATABASE_URL // e.g. from env
//   },
//   // helper factory for tenant connections (used programmatically)
//   tenant: (schema) => ({
//     client: 'pg',
//     connection: {
//       host: process.env.DB_HOST || '127.0.0.1',
//       port: Number(process.env.DB_PORT) || 5432,
//       user: process.env.DB_USER || 'postgres',
//       password: process.env.DB_PASS || 'yourpassword',
//       database: process.env.DB_NAME || 'crm_dev'
//     },
//     migrations: {
//       directory: './src/database/tenant-migrations',
//       tableName: `${schema}_knex_migrations`
//     },
//     // ensure tenant schema first in search path
//     searchPath: [schema, 'public']
//   })
// };


// knexfile.js
require("dotenv").config();
const path = require("path");

const baseConnection = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "crm_dev",
  port: Number(process.env.DB_PORT) || 5432,
};

const baseConfig = {
  client: "pg",
  pool: { min: 2, max: 10 },
  // seeds: {
  //   directory: "./src/database/seeders",
  // },
};

// --------------------------
// MASTER DB CONFIG
// --------------------------
module.exports = {
  development: {
    ...baseConfig,
    connection: baseConnection,
    migrations: {
      directory: path.join(__dirname, "src/database/master-migrations"),
      tableName: "knex_master_migrations",
    }
  },

  // --------------------------
  // PRODUCTION
  // --------------------------
  production: {
    ...baseConfig,
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/database/master-migrations",
      tableName: "knex_master_migrations",
    },
     
  },

  // --------------------------
  // TENANT CONNECTION FACTORY
  // (Used programmatically)
  // --------------------------
  // Each tenant uses same connection but different schema searchPath.
  // tenantConfig(schemaName) {
  //   return {
  //     ...baseConfig,
  //     connection: baseConnection,
  //     searchPath: [schemaName, "public"],
  //     migrations: {
  //       directory: "./src/database/tenant-migrations",
  //       tableName: `${schemaName}_migrations`, // e.g. tenant_123_migrations
  //     },
  //   };
  // },

  tenantConfig(schemaName) {
    return {
      ...baseConfig,
      connection: baseConnection,
      searchPath: [schemaName, 'public'], // first schema is tenant
      migrations: {
        directory: path.join(__dirname, "src/database/tenant-migrations"),
        tableName: `${schemaName}_migrations`,
      },
      
    };
  }
};
