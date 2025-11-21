const db = require("../../db/connection");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async createModule(data) {
    const module_id = uuidv4();

    const payload = {
      id: module_id,
      tenant_id: data.tenant_id,
      module_key: data.module_key,
      name: data.name,
      config: data.config || null,
      is_enabled: true,
    };

    await db("custom_modules").insert(payload);

    return payload;
  },

  async getModules(tenant_id) {
    return await db("custom_modules")
      .where({ tenant_id, is_enabled: true })
      .select("id", "module_key", "name", "config");
  },

  async getModuleById(module_id) {
    return await db("custom_modules")
      .where({ id: module_id })
      .first();
  },

  async updateModule(module_id, data) {
    await db("custom_modules")
      .where({ id: module_id })
      .update({
        name: data.name,
        config: data.config || null,
        updated_at: db.fn.now(),
      });

    return this.getModuleById(module_id);
  },

  async deleteModule(module_id) {
    return await db("custom_modules")
      .where({ id: module_id })
      .del();
  },
};
