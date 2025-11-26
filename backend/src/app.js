// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const superAdminRoutes = require('./modules/super-admin/routes');
const tenantAuthRoutes = require('./modules/tenant/routes');
const leadsRoutes = require('./modules/crm/leads/lead.routes');
const authRoutes = require('./auth/auth.routes');

const tenantResolver = require('./middleware/tenantResolver');
const tenantCleanup = require('./middleware/tenantCleanup');

const { authenticateJWT, authorizeRoles } = require('./middleware/auth');


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/superadmin', authenticateJWT,superAdminRoutes);

app.use('/api/v1/tenant', authenticateJWT,tenantAuthRoutes);

// tenant-protected CRM routes: apply tenantResolver then cleanup
app.use('/api/v1/crm/leads',  
  tenantResolver,
  tenantCleanup,
  authenticateJWT,
  authorizeRoles('admin', 'manager', 'staff'), // only allowed roles
  // leadsRoutes
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
