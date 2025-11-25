const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = require("./env");

module.exports = {
  client: "pg",
  connection: {
    host: DB_HOST,
    port: 5432,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  },
  pool: { min: 2, max: 10 },
};
