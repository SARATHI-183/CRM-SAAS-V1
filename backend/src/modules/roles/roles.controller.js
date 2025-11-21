const rolesService = require("./roles.service");

async function listRoles(req, res) {
  try {
    const roles = await rolesService.listRoles(req.user);
    res.json({ count: roles.length, roles });
  } catch (err) {
    console.error("listRoles:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getRole(req, res) {
  try {
    const role = await rolesService.getRole(req.user, req.params.id);
    res.json(role);
  } catch (err) {
    console.error("getRole:", err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
  }
}

async function createRole(req, res) {
  try {
    const role = await rolesService.createRole(req.user, req.body);
    res.status(201).json({ role });
  } catch (err) {
    console.error("createRole:", err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
  }
}

async function deleteRole(req, res) {
  try {
    await rolesService.deleteRole(req.user, req.params.id);
    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error("deleteRole:", err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
  }
}

module.exports = { listRoles, getRole, createRole, deleteRole };
