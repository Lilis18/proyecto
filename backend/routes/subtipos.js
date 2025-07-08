const express = require('express');
const router = express.Router();
const Subtipo = require('../models/Subtipo'); // Modelo de Subtipo

// Obtener subtipos por tipo
router.get('/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;
    const subtipos = await Subtipo.find({ tipo });
    res.json(subtipos);
  } catch (error) {
    console.error('Error al obtener subtipos:', error);
    res.status(500).json({ error: 'Error al obtener subtipos' });
  }
});

module.exports = router;
