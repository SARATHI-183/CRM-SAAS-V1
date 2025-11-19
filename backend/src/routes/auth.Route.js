const express = require('express');

const jwt = require("jsonwebtoken");
const knex = require("../db/connection"); // your knex connection
const bcrypt = require("bcryptjs");



const router = express.Router();

// POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id, tenant_id: user.tenant_id },
      ENV_VARS.JWT_SECRET, // replace with env in production
      { expiresIn: "8h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
