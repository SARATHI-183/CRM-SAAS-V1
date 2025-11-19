// src/controllers/authController.js
const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await db("users").where({ email }).first();
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({
      id: user.id,
      role_id: user.role_id,
      tenant_id: user.tenant_id,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        tenant_id: user.tenant_id,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error logging in" });
  }
}

module.exports = { login };
