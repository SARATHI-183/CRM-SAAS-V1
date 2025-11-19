// seeds/004_custom_modules.js
exports.seed = async function (knex) {
  await knex("custom_modules").del();
  await knex("custom_fields").del();

  await knex("custom_modules").insert([
    { id: 1, tenant_id: 1, module_key: "patient_records", name: "Patient Records", is_enabled: true },
    { id: 2, tenant_id: 2, module_key: "inventory", name: "Inventory", is_enabled: true },
  ]);

  await knex("custom_fields").insert([
    { module_id: 1, field_key: "age", label: "Age", field_type: "number", is_required: true },
    { module_id: 2, field_key: "stock_quantity", label: "Stock Quantity", field_type: "number", is_required: true },
  ]);
};
