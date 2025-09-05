// middleware/roles.js
const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "No autenticado" });
    }
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ msg: "No autorizado" });
    }
    next();
  };
};

module.exports = { requireRole };
