exports.up = function (knex) {
  return knex.schema.alterTable("custom_modules", (table) => {
    table.unique(["tenant_id", "module_key"], "uniq_custom_module_key_per_tenant");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("custom_modules", (table) => {
    table.dropUnique(["tenant_id", "module_key"], "uniq_custom_module_key_per_tenant");
  });
};
