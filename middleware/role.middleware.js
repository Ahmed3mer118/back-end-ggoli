exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: not allowed role" });
        }
        next();
    };
};

// Check if user has at least one of the provided permissions
exports.authorizePermissions = (...requiredPermissions) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // If user is admin, allow all
        if (user.role === 'admin') {
            return next();
        }

        const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];

        const hasPermission = requiredPermissions.some((permission) => userPermissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({ message: "Access denied: insufficient permissions" });
        }
        next();
    };
};

// Shorthand to allow roles OR permissions
exports.allow = ({ roles = [], permissions = [] } = {}) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (roles.includes(user.role)) {
            return next();
        }

        const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
        const hasPermission = permissions.some((p) => userPermissions.includes(p));
        if (hasPermission) {
            return next();
        }

        return res.status(403).json({ message: "Access denied" });
    };
};