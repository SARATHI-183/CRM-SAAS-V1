exports.up = function (knex) {
  return knex.schema.createTable("audit_logs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    
    table.uuid("tenant_id").nullable();
    table.uuid("user_id").notNullable();
    
    table.string("module").notNullable();
    table.string("action").notNullable();
    table.uuid("entity_id").nullable();
    
    table.jsonb("old_data").nullable();
    table.jsonb("new_data").nullable();
    
    table.string("ip_address").nullable();
    table.string("user_agent").nullable();
    
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("audit_logs");
};
