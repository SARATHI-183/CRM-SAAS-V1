const dotenv = require('dotenv');

dotenv.config();

const ENV_VARS = {
    DB_PASSWORD: process.env.DB_PASSWORD,
    PORT : process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV
};

module.exports = { ENV_VARS };