// src/modules/super-admin/routes.js
const router = require('express').Router();
const ctrl = require('./controller');

router.post('/login', ctrl.login);

router.post('/logout', ctrl.logout);

// Note: protect these routes with superadmin auth middleware in production
router.post('/tenants', ctrl.createTenantHandler);

router.post('/tenants/:tenantId/users', ctrl.createTenantUserHandler);


module.exports = router;
