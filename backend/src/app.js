const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// Middleware
const authMiddleware = require('./middlewares/auth');

// Routes
const authRoutes = require('./routes/authRoute');
const tenantRoutes = require('./routes/tenantsRoute');
const moduleRoutes = require('./routes/moduleRoute');
const usersRoutes = require("./routes/usersRoute");
const superAdminModules = require("./routes/superadmin/module");
const rolesRoute = require("./routes/rolesRoute");


const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

app.use(fileUpload());


app.use('/api/v1/auth', authRoutes);

// Protected Routes
app.use('/api/v1/tenants', authMiddleware, tenantRoutes);
app.use('/api/v1/modules', authMiddleware, moduleRoutes);
app.use("/api/v1/users", authMiddleware, usersRoutes);
app.use("/api/v1/superadmin/modules", authMiddleware, superAdminModules);
app.use("/api/v1/roles", authMiddleware, rolesRoute);


app.use(errorHandlers.notFound);

app.use(errorHandlers.productionErrors);


module.exports = app;
