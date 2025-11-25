// src/modules/crm/leads/lead.routes.js
const router = require('express').Router();
const ctrl = require('./lead.controller');

// middleware ensures req.db exists (tenantResolver)
router.get('/', ctrl.listHandler);
router.post('/', ctrl.createHandler);

module.exports = router;
