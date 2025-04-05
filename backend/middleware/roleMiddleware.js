
/**
 * Middleware to check if a user has the required role(s)
 * @param {string|string[]} roles - A single role string or array of role strings
 * @returns {function} - Express middleware function
 */
module.exports = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Normalize roles to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has admin role (admins can access everything)
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user has one of the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: allowedRoles, 
        userRole: req.user.role
      });
    }
    
    next();
  };
};
