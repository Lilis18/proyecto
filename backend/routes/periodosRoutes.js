const express = require('express');
const { getPeriodos, togglePeriodo } = require('../controllers/periodosController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roles');

const router = express.Router();

// 🔹 Solo usuarios autenticados pueden ver
router.get('/', protect, getPeriodos);

// 🔹 Solo SUPER_ADMIN puede alternar periodos
router.put('/', protect, requireRole('SUPER_ADMIN'), togglePeriodo);

module.exports = router;
