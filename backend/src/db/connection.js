const knex = require("knex");
 
const knexConfig = require("../../knexfile.js");

require('dotenv').config();

const environment = process.env.NODE_ENV || "development";

// Create knex database instance
const db = knex(knexConfig[environment]);


module.exports = db;
