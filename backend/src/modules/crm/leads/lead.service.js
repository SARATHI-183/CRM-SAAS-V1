// src/modules/crm/leads/lead.service.js
// NOTE: db must be a tenant knex instance (req.db)
const DEFAULT_LEAD_FIELDS = ['id', 'title', 'status', 'contact_id', 'assigned_to', 'created_at', 'updated_at'];

async function listLeads(db, { page = 1, limit = 20, status, assigned_to }) {
  const offset = (page - 1) * limit;
  const q = db('leads').select(DEFAULT_LEAD_FIELDS).orderBy('created_at', 'desc').limit(limit).offset(offset);

  if (status) q.where('status', status);
  if (assigned_to) q.where('assigned_to', assigned_to);

  // explicit columns only (no SELECT *) and knex parameterizes bindings
  const rows = await q;
  return rows;
}

async function getLeadById(db, id) {
  // explicit select and parameterized
  const row = await db('leads').select(DEFAULT_LEAD_FIELDS).where('id', id).first();
  return row || null;
}

async function createLead(db, payload) {
  // only insert allowed fields to avoid unexpected columns
  const payloadToInsert = {
    title: payload.title,
    status: payload.status || 'new',
    contact_id: payload.contact_id || null,
    assigned_to: payload.assigned_to || null,
    meta: payload.meta || {}
  };
  const [lead] = await db('leads').insert(payloadToInsert).returning(DEFAULT_LEAD_FIELDS);
  return lead;
}

async function updateLead(db, id, payload) {
  const updateObj = {};
  if (payload.title !== undefined) updateObj.title = payload.title;
  if (payload.status !== undefined) updateObj.status = payload.status;
  if (payload.assigned_to !== undefined) updateObj.assigned_to = payload.assigned_to;
  if (payload.meta !== undefined) updateObj.meta = payload.meta;

  const [lead] = await db('leads').where('id', id).update(updateObj).returning(DEFAULT_LEAD_FIELDS);
  return lead;
}

module.exports = { listLeads, getLeadById, createLead, updateLead };
