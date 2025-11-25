// src/modules/tenant/routes.js
const router = require('express').Router();
const ctrl = require('./auth.controller');

router.post('/login', ctrl.loginHandler);

module.exports = router;
