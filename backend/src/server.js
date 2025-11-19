const express = require("express");
const db = require("./db/connection");

require('dotenv').config();

const PORT = process.env.PORT || 3000

const tenantRoutes = require("./routes/tenants");
const moduleRoutes = require("./routes/module.Route");
const authRoutes = require("./routes/auth.Route");


const authMiddleware = require("./middlewares/auth");

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/tenants", authMiddleware, tenantRoutes);
app.use("/api/v1/modules", authMiddleware, moduleRoutes);





app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
