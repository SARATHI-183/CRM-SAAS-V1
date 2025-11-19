const express = require("express");
const auth = require("../middlewares/auth");
const knex = require("../db/connection");
const db = require("../db/connection");

const router = express.Router();

// GET /api/v1/tenants → List all tenants
router.get("/", async (req, res) => {
  try {
    const tenants = await knex("tenants").select("*");
    res.json(tenants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/v1/tenants → Create a new tenant
router.post("/", async (req, res) => {
  const { company_name, industry_type, company_email, company_phone, company_website } = req.body;

  if (!company_name || !industry_type || !company_email)
    return res.status(400).json({ message: "company_name, industry_type, and company_email are required" });

  try {
    const [newTenant] = await knex("tenants")
      .insert({
        company_name,
        industry_type,
        company_email,
        company_phone: company_phone || null,
        company_website: company_website || null,
        created_at: new Date(),
      })
      .returning("*"); // returns inserted row

    res.status(201).json(newTenant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/v1/tenants/:id → Get single tenant
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const tenant = await knex("tenants").where({ id }).first();
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    res.json(tenant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
