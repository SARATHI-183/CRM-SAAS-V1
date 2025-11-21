// src/controllers/tenantsController.js
const db = require("../db/connection");
const { validate: isUuid } = require('uuid');

async function createTenant(req, res) {
  try {
    const { company_name, industry_type, company_email, company_phone, company_website } = req.body;

    if (!company_name || !industry_type || !company_email) {
      return res.status(400).json({
        message: "company_name, industry_type, and company_email are required",
      });
    }

    // check duplicate company email
    const exists = await db("tenants").where({ company_email }).first();
    if (exists) {
      return res.status(409).json({ message: "Tenant already exists" });
    }

    const [tenant] = await db("tenants")
      .insert({
        company_name,
        industry_type,
        company_email,
        company_phone,
        company_website,
        created_at: new Date(),
      })
      .returning("*");

    res.status(201).json(tenant);
  } catch (err) {
    console.error("createTenant:", err);
    res.status(500).json({ message: "Server error creating tenant" });
  }
}

async function getTenants(req, res) {
  try {
    const tenants = await db("tenants").select("*");
    res.json(tenants);
  } catch (err) {
    console.error("getTenants:", err);
    res.status(500).json({ message: "Error fetching tenants" });
  }
}

// async function getTenantById(req, res) {
//   try {
//     const { id } = req.params;
//     const tenant = await db("tenants").where({ id }).first();
//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     res.json(tenant);
//   } catch (err) {
//     console.error("getTenantById:", err);
//     res.status(500).json({ message: "Error fetching tenant" });
//   }
// }


async function getTenantById(req, res) {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ message: "Invalid tenant ID" });

    const tenant = await db("tenants").where({ id }).first();
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    res.json(tenant);
  } catch (err) {
    console.error("getTenantById:", err);
    res.status(500).json({ message: "Error fetching tenant" });
  }
}


module.exports = {
  createTenant,
  getTenants,
  getTenantById,
};
