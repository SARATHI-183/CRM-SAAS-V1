const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWT_SECRET_KEY } = process.env;

// payload: { id, role_id, tenant_id }
function generateToken(payload, expiresIn = "8h") {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
