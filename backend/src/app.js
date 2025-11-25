// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const superAdminRoutes = require('./modules/super-admin/routes');
const tenantAuthRoutes = require('./modules/tenant/routes');
const leadsRoutes = require('./modules/crm/leads/lead.routes');

const tenantResolver = require('./middleware/tenantResolver');
const tenantCleanup = require('./middleware/tenantCleanup');

const router = express.Router();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// public / master routes (super admin)
app.use('/api/v1/super-admin', superAdminRoutes);

// tenant auth (login)
app.use('/api/v1/tenant', tenantAuthRoutes);

// tenant-protected CRM routes: apply tenantResolver then cleanup
app.use('/api/v1/crm/leads', tenantResolver, tenantCleanup, leadsRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
