const { createTenant, createTenantUser } = require('./service');
const { findSuperAdminByEmail, validatePassword } = require('./service');
const { signToken } = require('../../utils/jwt');
const { JWT_EXPIRES_IN } = require('../../config/env');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const admin = await knex('super_admins').where({ email }).first();
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    // Update last login
    await knex('super_admins').where({ id: admin.id }).update({ last_login_at: new Date() });

    // Sign JWT
    const token = signToken({ id: admin.id, email: admin.email, role: admin.role });

    res.json({ token, expires_in: JWT_EXPIRES_IN });
  } catch (err) {
    console.error('Superadmin login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function logout(req, res, next) {
  try {
    // JWT is stateless, so logout is handled client-side.
    // Optionally implement token blacklist here if needed
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(err);
  }
}

async function createTenantHandler(req, res, next) {
  try {
    const payload = req.body; // { company_name, company_email, subscription_plan }
    const tenant = await createTenant(payload);
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
}

async function createTenantUserHandler(req, res) {
  try {
    const { tenantId } = req.params;
    const { full_name, email, password, role } = req.body;

    const user = await createTenantUser(tenantId, {
      full_name,
      email,
      password,
      role
    });

    return res.status(201).json({
      success: true,
      message: "Tenant user created",
      user
    });

  } catch (err) {
    console.error("Tenant User Creation Error:", err);
    res.status(400).json({ message: err.message });
  }
}

module.exports = { createTenantHandler, login, logout, createTenantUserHandler };
