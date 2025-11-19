// seeds/001_tenants.js
exports.seed = async function (knex) {
  // Delete existing tenants
  await knex("tenants").del();

  // Insert tenants
  await knex("tenants").insert([
    {
      id: 1,
      company_name: "Demo Tenant 1",
      industry_type: "E-commerce",
      company_email: "demo1@example.com",
      company_phone: "1234567890",
      company_website: "https://demo1.com",
      is_active: true,
    },
    {
      id: 2,
      company_name: "Demo Tenant 2",
      industry_type: "Retail",
      company_email: "demo2@example.com",
      company_phone: "0987654321",
      company_website: "https://demo2.com",
      is_active: true,
    },
  ]);
};
