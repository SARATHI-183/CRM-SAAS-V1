exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("roles").del();
  await knex("modules").del();

  // 1️⃣ Default Roles
  await knex("roles").insert([
    { id: 1, role_name: "Super Admin", description: "Owner of SaaS CRM" },
    { id: 2, role_name: "Admin", description: "Company Admin" },
    { id: 3, role_name: "Manager", description: "Team/Project Manager" },
    { id: 4, role_name: "Sales", description: "Sales Representative" },
    { id: 5, role_name: "Others", description: "Other Staff" },
  ]);

  // 2️⃣ Core Modules (system-wide, available for all industries)
  await knex("modules").insert([
    { module_name: "Dashboard", is_core: true, is_active: true },
    { module_name: "Leads", is_core: true, is_active: true },
    { module_name: "Customers", is_core: true, is_active: true },
    { module_name: "Quotes", is_core: true, is_active: true },
    { module_name: "Orders", is_core: true, is_active: true },
    { module_name: "Products", is_core: true, is_active: true },
    { module_name: "Invoices", is_core: true, is_active: true },
    { module_name: "Payments", is_core: true, is_active: true },
    { module_name: "Reports", is_core: true, is_active: true },
    { module_name: "Settings", is_core: true, is_active: true },
  ]);

  console.log("✅ Seeded roles and core modules successfully!");
};
