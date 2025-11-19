const jwt = require("jsonwebtoken");
require('dotenv').config();

export const generateTokenAndSetCookie = (payload, res, options = {}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: options.expiresIn || "8h",
  });

  res.cookie("crm_saas_token", token, {
    maxAge: options.maxAge || 8 * 60 * 60 * 1000, // default 8 hours
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
