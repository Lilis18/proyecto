const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { protect } = require('../middleware/authMiddleware'); // Middleware para validar token

// Ruta para guardar datos
router.post('/guardar', protect, async (req, res) => {
  try {
    const nuevoDato = new Data({
      usuario: req.user.id,
      tipo: req.body.tipo,
      subtipo: req.body.subtipo,
      resumen: req.body.resumen,
      indicador: req.body.indicador,
      periodos: req.body.periodos
    });

    await nuevoDato.save();
    res.status(201).json({ message: 'Datos guardados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar los datos' });
  }
});

// Obtener datos con filtros
router.get('/', protect, async (req, res) => {
    const { fin, proposito, componente, actividad } = req.query;

    const query = {};

    if (fin) query.fin = fin;
    if (proposito) query.proposito = proposito;
    if (componente) query.componente = componente;
    if (actividad) query.actividad = actividad;

    try {
        const data = await Data.find(query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los datos' });
    }
});

// Cambié auth por protect aquí
router.get('/subtipos/:tipo', protect, async (req, res) => {
  const { tipo } = req.params;
  try {
    const subtipos = await Data.find({ tipo }).distinct('subtipo');
    res.json({ subtipos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los subtipos' });
  }
});

// Actualizar un registro
router.put('/:id', protect, async (req, res) => {
    try {
        const actualizado = await Data.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(actualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el registro' });
    }
});

// Eliminar datos
router.delete('/:id', protect, async (req, res) => {
  try {
    const resultado = await Data.findByIdAndDelete(req.params.id);
    
    if (!resultado) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }

    res.json({ mensaje: 'Registro eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el dato' });
  }
});

router.get('/tipos', protect, async (req, res) => {
  try {
    const tipos = await Data.distinct('tipo');
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tipos' });
  }
});

router.get('/subtipos/:tipo', protect, async (req, res) => {
  const { tipo } = req.params;
  try {
    const subtipos = await Data.find({ tipo }).distinct('subtipo');
    res.json({ subtipos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los subtipos' });
  }
});


module.exports = router;
