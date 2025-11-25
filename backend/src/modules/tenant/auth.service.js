// src/modules/tenant/auth.service.js
const { tenantKnex } = require('../../database/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = '8h';

async function tenantLogin({ schema, email, password }) {
  const tk = tenantKnex(schema);
  try {
    const rows = await tk('users').whereRaw('LOWER(email) = LOWER(?)', [email]).limit(1);
    if (!rows || rows.length === 0) throw new Error('Invalid credentials');

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error('Invalid credentials');

    const token = jwt.sign({ sub: user.id, schema, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { token, user: { id: user.id, email: user.email, full_name: user.full_name } };
  } finally {
    await tk.destroy();
  }
}

module.exports = { tenantLogin };
