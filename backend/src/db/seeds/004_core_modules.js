const { v4: uuidv4 } = require("uuid");

exports.seed = async function (knex) {
  // Clear existing core modules
  await knex("modules").del();

  const coreModules = [
    { id: uuidv4(), module_key: "leads", module_name: "Leads", is_core: true },
    { id: uuidv4(), module_key: "contacts", module_name: "Contacts", is_core: true },
    { id: uuidv4(), module_key: "companies", module_name: "Companies", is_core: true },
    { id: uuidv4(), module_key: "deals", module_name: "Deals", is_core: true },
    { id: uuidv4(), module_key: "tasks", module_name: "Tasks", is_core: true },
    { id: uuidv4(), module_key: "tickets", module_name: "Tickets", is_core: true },
    { id: uuidv4(), module_key: "products", module_name: "Products", is_core: true },
    { id: uuidv4(), module_key: "invoices", module_name: "Invoices", is_core: true },
    { id: uuidv4(), module_key: "activities", module_name: "Activities", is_core: true },
    { id: uuidv4(), module_key: "campaigns", module_name: "Campaigns", is_core: true },
  ];

  // Insert and return IDs
  await knex("modules").insert(coreModules);
};
