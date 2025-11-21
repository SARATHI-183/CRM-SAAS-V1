exports.up = function (knex) {
  return knex.schema.table("roles", (table) => {
    table.uuid("tenant_id").index();
  });
};

exports.down = function (knex) {
  return knex.schema.table("roles", (table) => {
    table.dropColumn("tenant_id");
  });
};
