// Simple admin check middleware
exports.checkAdmin = (req, res, next) => {
  const password = req.headers['admin-password'] || req.body.adminPassword || req.query.adminPassword;
  
  if (password !== 'admin123') {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin password'
    });
  }
  
  req.isAdmin = true;
  next();
};

// No authentication needed - pass through
exports.noAuth = (req, res, next) => {
  next();
};
