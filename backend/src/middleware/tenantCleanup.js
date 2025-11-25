// src/middleware/tenantCleanup.js
module.exports = (req, res, next) => {
  res.on('finish', async () => {
    if (req.db && typeof req.db.destroy === 'function') {
      try { await req.db.destroy(); } catch (e) { /* ignore */ }
    }
  });
  next();
};
