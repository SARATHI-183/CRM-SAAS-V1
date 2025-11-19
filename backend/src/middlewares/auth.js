const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/jwt");
const db = require("../db/connection");


async function authMiddleware(req, res, next) {
  try {
    let auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No token provided" });

    const token = auth.includes(" ") ? auth.split(" ")[1] : auth;

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    req.user = {
      id: decoded.id,
      role_id: decoded.role_id,
      tenant_id: decoded.tenant_id
    };

    // optional: fetch fresh user (active flag) from DB
    const user = await db("users").where({ id: req.user.id }).first();
    if (!user || !user.is_active) return res.status(403).json({ message: "User inactive or not found" });

    // ensure tenant_id matches DB (defense in depth)
    if (user.tenant_id !== req.user.tenant_id) {
      // super admin may have tenant_id different; keep only strict check for tenant users
      // If mismatch, you may override to DB value:
      req.user.tenant_id = user.tenant_id;
    }

    next();
  } catch (err) {
    console.error("auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;