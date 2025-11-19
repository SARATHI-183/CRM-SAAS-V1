exports.up = function (knex) {
  return knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();

    table
      .integer("tenant_id")
      .unsigned()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE")
      .nullable(); 
    // Super Admin has tenant_id = null
    // Company Admin, Manager, Sales Rep belong to a tenant

    table.string("role_name").notNullable(); 
    // "Super Admin", "Admin", "Manager", "Sales Rep", "Custom Role"

    table.string("description");
    table.boolean("is_system_role").defaultTo(false);
    // true = system roles (Super Admin, Admin, Manager, Sales Rep)
    // false = tenant-created custom roles

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("roles");
};
