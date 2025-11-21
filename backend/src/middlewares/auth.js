// const jwt = require("jsonwebtoken");
// const { verifyToken } = require("../utils/jwt");
// const db = require("../db/connection");


// async function authMiddleware(req, res, next) {
//   try {
//     let auth = req.headers.authorization;
//     if (!auth) return res.status(401).json({ message: "No token provided" });

//     const token = auth.includes(" ") ? auth.split(" ")[1] : auth;

//     const decoded = verifyToken(token);
//     if (!decoded) return res.status(401).json({ message: "Invalid token" });

//     req.user = {
//       id: decoded.id,
//       role_id: decoded.role_id,
//       tenant_id: decoded.tenant_id
//     };

//     // optional: fetch fresh user (active flag) from DB
//     const user = await db("users").where({ id: req.user.id }).first();
//     if (!user || !user.is_active) return res.status(403).json({ message: "User inactive or not found" });

//     // ensure tenant_id matches DB (defense in depth)
//     if (user.tenant_id !== req.user.tenant_id) {
//       // super admin may have tenant_id different; keep only strict check for tenant users
//       // If mismatch, you may override to DB value:
//       req.user.tenant_id = user.tenant_id;
//     }

//     next();
//   } catch (err) {
//     console.error("auth error:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// module.exports = authMiddleware;

// const { verifyToken } = require("../utils/generateToken");
// const db = require("../db/connection");

// async function authMiddleware(req, res, next) {
//   try {
//     const auth = req.headers.authorization;
//     if (!auth) return res.status(401).json({ message: "No token provided" });

//     const token = auth.includes(" ") ? auth.split(" ")[1] : auth;

//     const decoded = verifyToken(token);
//     if (!decoded) return res.status(401).json({ message: "Invalid token" });

//     req.user = {
//       id: decoded.id,
//       role_id: decoded.role_id,
//       tenant_id: decoded.tenant_id
//     };

//     // Fetch fresh user
//     const user = await db("users").where({ id: req.user.id }).first();
//     if (!user || !user.is_active)
//       return res.status(403).json({ message: "User inactive or not found" });

//     // Tenant validation: only for tenant users
//     if (user.tenant_id && user.tenant_id !== req.user.tenant_id) {
//       req.user.tenant_id = user.tenant_id;
//     }

//     next();
//   } catch (err) {
//     console.error("auth error:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// module.exports = authMiddleware;

// src/middlewares/auth.js
// const { verifyToken } = require("../utils/generateToken");
// const db = require("../db/connection");

// async function authMiddleware(req, res, next) {
//   try {
//     const auth = req.headers.authorization;
//     if (!auth) return res.status(401).json({ message: "No token provided" });

//     const token = auth.includes(" ") ? auth.split(" ")[1] : auth;
//     const decoded = verifyToken(token);
//     if (!decoded) return res.status(401).json({ message: "Invalid token" });

//     req.user = {
//       id: decoded.id,
//       role_id: decoded.role_id,
//       tenant_id: decoded.tenant_id
//     };

//     const user = await db("users").where({ id: req.user.id }).first();
//     if (!user || !user.is_active) return res.status(403).json({ message: "User inactive or not found" });

//     if (user.tenant_id && user.tenant_id !== req.user.tenant_id) {
//       req.user.tenant_id = user.tenant_id;
//     }

//     next();
//   } catch (err) {
//     console.error("auth error:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// // ✅ Super Admin check middleware
// function ensureSuperAdmin(req, res, next) {
//   if (!req.user || req.user.role_id !== 1) {
//     return res.status(403).json({ message: "Forbidden: Super Admin only" });
//   }
//   next();
// }

// module.exports = { authMiddleware, ensureSuperAdmin };


// const { verifyToken } = require("../utils/generateToken");
// const db = require("../db/connection");

// async function authMiddleware(req, res, next) {
//   try {
//     const auth = req.headers.authorization;
//     if (!auth) return res.status(401).json({ message: "No token provided" });

//     const token = auth.includes(" ") ? auth.split(" ")[1] : auth;
//     const decoded = verifyToken(token);
//     if (!decoded) return res.status(401).json({ message: "Invalid token" });

//     // Fetch user along with role_key
//     const user = await db("users")
//       .join("roles", "roles.id", "users.role_id")
//       .select("users.*", "roles.role_key")
//       .where("users.id", decoded.id)
//       .first();

//     if (!user || !user.is_active)
//       return res.status(403).json({ message: "User inactive or not found" });

//     req.user = {
//       id: user.id,
//       tenant_id: user.tenant_id,
//       role_key: user.role_key, // ✅ add role_key
//     };

//     next();
//   } catch (err) {
//     console.error("auth error:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// // ✅ Super Admin check middleware
// function ensureSuperAdmin(req, res, next) {
//   if (!req.user || req.user.role_key !== "super_admin") {
//     return res.status(403).json({ message: "Forbidden: Super Admin only" });
//   }
//   next();
// }

// module.exports = { authMiddleware, ensureSuperAdmin };


// src/middlewares/auth.js
const { verifyToken } = require("../utils/generateToken");
const db = require("../db/connection");

// Middleware to authenticate JWT token
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;
    const decoded = verifyToken(token);

    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    // Attach user info from token
    req.user = {
      id: decoded.id,
      tenant_id: decoded.tenant_id || null,
      role_key: decoded.role_key,  // important for superadmin check
    };

    // Fetch fresh user data from DB
    const user = await db("users").where({ id: req.user.id }).first();
    if (!user || !user.is_active) return res.status(403).json({ message: "User inactive or not found" });

    // Sync tenant_id from DB
    if (user.tenant_id && user.tenant_id !== req.user.tenant_id) {
      req.user.tenant_id = user.tenant_id;
    }

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware to ensure Super Admin access
function ensureSuperAdmin(req, res, next) {
  if (!req.user || req.user.role_key !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Super Admin only" });
  }
  next();
}

module.exports = { authMiddleware, ensureSuperAdmin };
