// src/modules/crm/leads/lead.controller.js
const svc = require('./lead.service');

async function listHandler(req, res, next) {
  try {
    const db = req.db; // tenantKnex schema instance injected by tenantResolver middleware
    const { page, limit } = req.query;
    const data = await svc.listLeads(db, { page: Number(page) || 1, limit: Number(limit) || 20 });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createHandler(req, res, next) {
  try {
    const db = req.db;
    const payload = req.body;
    const created = await svc.createLead(db, payload);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

module.exports = { listHandler, createHandler };
