module.exports = (req, res, next) => {
  console.log("HEADERS RECEIVED:", req.headers);

  // normalize all possible header formats
  const orgId =
    req.headers['x-org-id'] ||
    req.headers['x_org_id'] ||
    req.headers['orgid'] ||
    req.headers['org_id'];

  if (req.path === '/' || req.path === '/health' || req.path.startsWith('/auth')) {
    return next();
  }

  if (!orgId) {
    return res.status(400).json({ error: 'Organization ID missing' });
  }

  req.orgId = orgId;
  next();
};