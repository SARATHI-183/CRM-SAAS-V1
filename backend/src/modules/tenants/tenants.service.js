// src/modules/tenants/tenants.service.js
const db = require("../../db/connection");
const { validate: isUuid } = require("uuid");

async function createTenantService(data) {
  const { company_name, industry_type, company_email, company_phone, company_website } = data;

  // Check duplicate
  const exists = await db("tenants").where({ company_email }).first();
  if (exists) throw { status: 409, message: "Tenant already exists" };

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

  return tenant;
}

async function listTenantsService() {
  return db("tenants").select("*");
}

async function getTenantByIdService(id) {
  if (!isUuid(id)) throw { status: 400, message: "Invalid tenant ID" };

  const tenant = await db("tenants").where({ id }).first();
  if (!tenant) throw { status: 404, message: "Tenant not found" };

  return tenant;
}

module.exports = {
  createTenantService,
  listTenantsService,
  getTenantByIdService,
};
