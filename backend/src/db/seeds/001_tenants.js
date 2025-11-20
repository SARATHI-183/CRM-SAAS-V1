// seeds/tenants_seed.js
exports.seed = async function(knex) {
  await knex("tenants").del();

  await knex("tenants").insert([
    {
      company_name: "Demo Tenant 1",
      industry_type: "E-commerce",
      company_email: "demo1@example.com",
      company_phone: "1234567890",
      company_website: "https://demo1.com",
      is_active: true
    },
    {
      company_name: "Demo Tenant 2",
      industry_type: "Retail",
      company_email: "demo2@example.com",
      company_phone: "0987654321",
      company_website: "https://demo2.com",
      is_active: true
    }
  ]);
};
