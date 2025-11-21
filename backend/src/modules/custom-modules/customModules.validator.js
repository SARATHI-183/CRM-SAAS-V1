const { validate: isUuid } = require("uuid");

function validateCreateModule(req, res, next) {
  const { tenant_id, module_key, name } = req.body;

  if (!tenant_id || !module_key || !name)
    return res.status(400).json({ message: "tenant_id, module_key, name required" });

  if (!isUuid(tenant_id))
    return res.status(400).json({ message: "Invalid tenant_id" });

  next();
}

module.exports = { validateCreateModule };
