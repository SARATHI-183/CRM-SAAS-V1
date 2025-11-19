exports.up = function (knex) {
  return knex.schema.createTable("modules", (table) => {
    table.increments("id").primary();

    table
      .integer("tenant_id")
      .unsigned()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE")
      .nullable(); 
    // null = system module (available for all industries)
    // tenant_id = specific tenant module

    table.string("module_name").notNullable();
    table.string("industry").nullable();
    // e.g., "Hospital", "Retail", "E-commerce", "Manufacturing"

    table.boolean("is_active").defaultTo(true);
    table.boolean("is_core").defaultTo(false);
    // true = core module, false = optional add-on

    table.string("description").nullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("modules");
};
