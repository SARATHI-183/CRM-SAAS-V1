require('dotenv').config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: process.env.DB_PASSWORD,
      database: "crm_saas"
    },
    migrations: {
      directory: "./src/db/migrations"
    },
    seeds: {
      directory: "./src/db/seeds"   // <-- add this
    }
  }
};
