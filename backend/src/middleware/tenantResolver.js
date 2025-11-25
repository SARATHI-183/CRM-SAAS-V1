// src/middleware/tenantResolver.js
// This middleware extracts schema from token payload OR header and attaches a tenant-specific knex instance to req.db
const jwt = require('jsonwebtoken');
const { tenantKnex } = require('../database/knex');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function tenantResolverFromHeader(req, res, next) {
  // Prefer Authorization header JWT, else expect X-Tenant-Schema header
  const auth = req.headers.authorization;
  let schema;

  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.slice(7);
      const payload = jwt.verify(token, JWT_SECRET);
      schema = payload.schema;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else if (req.headers['x-tenant-schema']) {
    schema = req.headers['x-tenant-schema'];
  } else {
    return res.status(400).json({ message: 'Tenant schema header or token required' });
  }

  try {
    req.db = tenantKnex(schema);
    req.tenantSchema = schema;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = tenantResolverFromHeader;
