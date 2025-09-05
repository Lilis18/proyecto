const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppSettings = require("../models/AppSettings");
const { protect } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

// Registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'El usuario ya existe' });

    // Contar cuántos usuarios existen
    const count = await User.countDocuments();

    const role = count === 0 ? "SUPER_ADMIN" : "USER";

    // 🔹 Crear el usuario (el hash se hace en el pre('save'))
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // 🔹 Si es SUPER_ADMIN, guardamos en AppSettings
    if (role === "SUPER_ADMIN") {
      let settings = await AppSettings.findOne();
      if (!settings) {
        settings = new AppSettings({ superAdminId: newUser._id });
      } else {
        settings.superAdminId = newUser._id;
      }
      await settings.save();
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      name: newUser.name,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el registro' });
  }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        // 🔹 El método compare se hace con la contraseña ya hasheada en DB
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            role: user.role,
            nombre: user.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en login' });
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

        const esCorrecta = await user.matchPassword(contrasenaActual);
        if (!esCorrecta) {
            return res.status(400).json({ msg: 'La contraseña actual es incorrecta' });
        }

        user.password = nuevaContrasena; // el pre('save') hará el hash automáticamente
        await user.save();

        res.json({ msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ msg: 'Error al actualizar la contraseña' });
    }
});

module.exports = router;
