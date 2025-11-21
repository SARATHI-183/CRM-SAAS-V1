const service = require("./customModules.service");
const { validate: isUuid } = require("uuid");

exports.createModule = async (req, res) => {
  try {
    const moduleData = req.body;

    const created = await service.createModule(moduleData);

    res.status(201).json(created);
  } catch (err) {
    console.error("createModule:", err);
    res.status(500).json({ message: "Failed to create custom module" });
  }
};

exports.getModules = async (req, res) => {
  try {
    const { tenant_id } = req.params;

    if (!isUuid(tenant_id)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const modules = await service.getModules(tenant_id);
    res.json(modules);
  } catch (err) {
    console.error("getModules:", err);
    res.status(500).json({ message: "Error fetching modules" });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const { module_id } = req.params;

    if (!isUuid(module_id))
      return res.status(400).json({ message: "Invalid module ID" });

    const mod = await service.getModuleById(module_id);

    if (!mod)
      return res.status(404).json({ message: "Module not found" });

    res.json(mod);
  } catch (err) {
    console.error("getModuleById:", err);
    res.status(500).json({ message: "Error fetching module" });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { module_id } = req.params;

    if (!isUuid(module_id))
      return res.status(400).json({ message: "Invalid module ID" });

    const updated = await service.updateModule(module_id, req.body);

    res.json(updated);
  } catch (err) {
    console.error("updateModule:", err);
    res.status(500).json({ message: "Error updating module" });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { module_id } = req.params;

    if (!isUuid(module_id))
      return res.status(400).json({ message: "Invalid module ID" });

    await service.deleteModule(module_id);

    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error("deleteModule:", err);
    res.status(500).json({ message: "Error deleting module" });
  }
};
