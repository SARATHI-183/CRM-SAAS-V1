// const jwt = require("jsonwebtoken");
// require('dotenv').config();

// export const generateTokenAndSetCookie = (payload, res, options = {}) => {
//   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: options.expiresIn || "8h",
//   });

//   res.cookie("crm_saas_token", token, {
//     maxAge: options.maxAge || 8 * 60 * 60 * 1000, // default 8 hours
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development",
//   });

//   return token;
// };

// export const verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET_KEY);
// };


// const jwt = require("jsonwebtoken");
// require('dotenv').config();

// function generateTokenAndSetCookie(payload, res, options = {}) {
//   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: options.expiresIn || "8h",
//   });

//   res.cookie("crm_saas_token", token, {
//     maxAge: options.maxAge || 8 * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development",
//   });

//   return token;
// }

// function verifyToken(token) {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET_KEY);
//   } catch (err) {
//     return null;
//   }
// }

// module.exports = { generateTokenAndSetCookie, verifyToken };


// src/utils/generateToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT token and optionally set cookie
function generateTokenAndSetCookie(payload, res, options = {}) {
  const token = jwt.sign(
    {
      id: payload.id,
      tenant_id: payload.tenant_id || null,
      role_key: payload.role_key,  // include role_key
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: options.expiresIn || "8h" }
  );

  if (res) {
    res.cookie("crm_saas_token", token, {
      maxAge: options.maxAge || 8 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
  }

  return token;
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = { generateTokenAndSetCookie, verifyToken };
