const router = require('express').Router();
const ctrl = require('./controller');
const { authenticateJWT, authorizeRoles } = require('../../middleware/auth');

// Only tenant admin or superadmin can add more admins
router.post('/admins', authenticateJWT, authorizeRoles('admin', 'superadmin'), ctrl.addTenantAdmin);

module.exports = router;
