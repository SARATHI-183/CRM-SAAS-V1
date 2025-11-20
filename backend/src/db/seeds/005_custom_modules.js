// // 005_custom_fields.js
// const { v4: uuidv4 } = require("uuid");

// exports.seed = async function (knex) {
//   await knex("custom_fields").del();

//   // fetch modules from DB to get IDs dynamically
//   const modules = await knex("modules").select("id", "module_key");

//   if (!modules.length) {
//     throw new Error("No modules found. Make sure core modules seed ran first!");
//   }

//   const leadModule = modules.find(m => m.module_key === "leads");
//   const contactModule = modules.find(m => m.module_key === "contacts");

//   if (!leadModule || !contactModule) {
//     throw new Error("Required modules not found (leads or contacts)");
//   }

//   const customFields = [
//     {
//       id: uuidv4(),
//       field_key: "lead_source",
//       field_type: "text",
//       is_required: true,
//       label: "Lead Source",
//       module_id: leadModule.id,
//     },
//     {
//       id: uuidv4(),
//       field_key: "lead_status",
//       field_type: "dropdown",
//       is_required: true,
//       label: "Lead Status",
//       module_id: leadModule.id,
//     },
//     {
//       id: uuidv4(),
//       field_key: "contact_type",
//       field_type: "text",
//       is_required: false,
//       label: "Contact Type",
//       module_id: contactModule.id,
//     },
//   ];

//   await knex("custom_fields").insert(customFields);
// };

// 005_custom_modules_fields.js
const { v4: uuidv4 } = require("uuid");

exports.seed = async function (knex) {
  // Clear previous data
  await knex("custom_fields").del();
  await knex("custom_modules").del();

  // ---------- Insert custom modules ----------
  const customModulesData = [
    { id: uuidv4(), tenant_id: null, module_key: "patient_records", name: "Patient Records", config: null, is_enabled: true },
    { id: uuidv4(), tenant_id: null, module_key: "inventory", name: "Inventory", config: null, is_enabled: true },
  ];

  const insertedModules = await knex("custom_modules").insert(customModulesData).returning(["id", "module_key"]);

  // Map module_key to id for easy reference
  const moduleMap = {};
  insertedModules.forEach(mod => {
    moduleMap[mod.module_key] = mod.id;
  });

  // ---------- Insert custom fields ----------
  const customFieldsData = [
    {
      id: uuidv4(),
      module_id: moduleMap["patient_records"],
      field_key: "patient_name",
      label: "Patient Name",
      field_type: "text",
      is_required: true,
      meta: null,
    },
    {
      id: uuidv4(),
      module_id: moduleMap["patient_records"],
      field_key: "patient_age",
      label: "Patient Age",
      field_type: "number",
      is_required: false,
      meta: null,
    },
    {
      id: uuidv4(),
      module_id: moduleMap["inventory"],
      field_key: "item_name",
      label: "Item Name",
      field_type: "text",
      is_required: true,
      meta: null,
    },
    {
      id: uuidv4(),
      module_id: moduleMap["inventory"],
      field_key: "item_quantity",
      label: "Item Quantity",
      field_type: "number",
      is_required: true,
      meta: null,
    },
  ];

  await knex("custom_fields").insert(customFieldsData);
};
