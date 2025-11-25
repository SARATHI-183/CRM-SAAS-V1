// src/modules/tenant/auth.controller.js
const svc = require('./auth.service');

async function loginHandler(req, res, next) {
  try {
    const { schema, email, password } = req.body;
    if (!schema || !email || !password) return res.status(400).json({ message: 'schema,email,password required' });
    const result = await svc.tenantLogin({ schema, email, password });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { loginHandler };
