// src/modules/super-admin/routes.js
const router = require('express').Router();
const ctrl = require('./controller');

// Note: protect these routes with superadmin auth middleware in production
router.post('/tenants', ctrl.createTenantHandler);

module.exports = router;
