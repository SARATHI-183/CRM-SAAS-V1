// src/database/tenant-migrations/006_custom_fields.js
exports.up = async function(knex) {

  // ---------------------------------------
  // CUSTOM FIELDS TABLE
  // ---------------------------------------
  await knex.schema.createTable('custom_fields', (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('module_key', 100)
      .notNullable(); // e.g., 'leads', 'contacts'

    t.string('field_key', 100)
      .notNullable(); // internal key for the field

    t.string('label', 200)
      .notNullable(); // human-readable label

    t.string('type', 50)
      .notNullable(); // text, number, select, date, boolean

    t.jsonb('options')
      .notNullable()
      .defaultTo('[]'); // for select/radio fields

    t.boolean('is_required')
      .notNullable()
      .defaultTo(false);

    t.jsonb('meta')
      .notNullable()
      .defaultTo('{}'); // extra info like placeholder, validation rules

    t.timestamps(true, true);

    t.unique(['module_key', 'field_key']);
  });

  // Index for faster lookups by module
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_custom_fields_module_key
    ON custom_fields (module_key);
  `);

  // ---------------------------------------
  // CUSTOM MODULE DATA TABLE
  // ---------------------------------------
  await knex.schema.createTable('custom_module_data', (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('module_key', 100)
      .notNullable();

    t.jsonb('data')
      .notNullable()
      .defaultTo('{}'); // actual custom field values

    t.timestamps(true, true);
  });

  // GIN index for fast JSONB querying
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_custom_module_data_jsonb
    ON custom_module_data USING GIN (data);
  `);

  // Index by module_key for filtering
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_custom_module_data_module_key
    ON custom_module_data (module_key);
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('custom_module_data');
  await knex.schema.dropTableIfExists('custom_fields');
};
