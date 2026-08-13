// gate a route to specific roles, e.g. requireRole(['admin', 'faculty'])
const { sendError } = require('../utils/response');

function requireRole(allowedRoles) {
  return function checkUserRole(req, res, next) {
    const userRoleName = req.currentUser?.role?.name;

    if (!allowedRoles.includes(userRoleName)) {
      return sendError(res, 403, "You don't have permission to do that");
    }

    next();
  };
}

// data-driven check that reads specific permission keys from roles.permissions jsonb
function requirePermission(permissionKey) {
  return function checkUserPermission(req, res, next) {
    const userPermissions = req.currentUser?.role?.permissions || {};

    if (!userPermissions[permissionKey]) {
      return sendError(res, 403, "You don't have permission to do that");
    }

    next();
  };
}

module.exports = { requireRole, requirePermission };
