const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware')

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

// Registro
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'El usuario ya existe' });

        const newUser = new User({ name, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, name: newUser.name });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el registro' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            nombre: user.name // Devuelve el nombre del usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Ruta para cambio de contraseña
router.put('/cambiar-contrasena', protect, async (req, res) => {
  const { contrasenaActual, nuevaContrasena } = req.body;

  if (!contrasenaActual || !nuevaContrasena) {
    return res.status(400).json({ msg: 'Debes proporcionar la contraseña actual y la nueva' });
  }

  try {
    const user = await User.findById(req.usuarioId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    // Usa el método del esquema
    const esCorrecta = await user.matchPassword(contrasenaActual);
    if (!esCorrecta) {
      return res.status(400).json({ msg: 'La contraseña actual es incorrecta' });
    }

    user.password = nuevaContrasena; // Al guardar, el pre('save') hará el hash automáticamente
    await user.save();

    res.json({ msg: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ msg: 'Error al actualizar la contraseña' });
  }
});

module.exports = router;