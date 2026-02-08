const jwt = require('jsonwebtoken');

// Middleware to verify JWT token or localStorage-based auth for development
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  // If no token provided, check for development mode authentication
  if (!token) {
    // For development: accept localStorage-based authentication
    const userEmail = req.header('X-User-Email');
    const userRole = req.header('X-User-Role');

    if (userEmail && userRole) {
      // Create a mock user object for development
      req.user = {
        email: userEmail,
        role: userRole,
        id: 'dev-user-123',
        permissions: getPermissionsForRole(userRole)
      };
      return next();
    }

    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Helper function to get permissions based on role (same as frontend)
const getPermissionsForRole = (roleName) => {
  const rolePermissions = {
    'Super Admin': ['*'],
    'Manager': ['dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 'invoice.view', 'invoice.create', 'reports.view'],
    'Supervisor': ['dashboard.view', 'day_business.view', 'day_business.edit', 'reports.view'],
    'Operator': ['dashboard.view', 'day_business.view'],
    'Viewer': ['dashboard.view']
  };
  return rolePermissions[roleName] || ['dashboard.view'];
};

module.exports = { verifyToken };