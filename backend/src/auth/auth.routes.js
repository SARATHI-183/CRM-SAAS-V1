// src/auth/route.js
const express = require('express');
const router = express.Router();
const ctrl = require('./auth.controller');

// POST /api/v1/auth/login
router.post('/login', ctrl.login);

// POST /api/v1/auth/logout
router.post('/logout', ctrl.logout);

module.exports = router;