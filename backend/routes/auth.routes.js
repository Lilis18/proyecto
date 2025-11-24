console.log("📌 Cargando auth.routes.js");

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
    if (userExists) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
      
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
    console.error("❌ Error en /register:", error);
    res.status(500).json({ msg: 'Error en el registro', error: error.message });
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
            { id: user._id,
              role: user.role, },
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

const onlySuperAdmin = async (req, res, next) => {
  try {
    // Revisar rol REAL desde req.user (ya viene de la BD)
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ msg: "No autorizado - Solo SUPER_ADMIN" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en validación de permisos" });
  }
};

// 🔹 Cambiar rol de usuario
router.put("/users/:id/role", protect, onlySuperAdmin, async (req, res) => {
  const { role } = req.body;
  if (!["ADMIN", "USER"].includes(role)) {
    return res.status(400).json({ msg: "Rol no válido" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    user.role = role;
    await user.save();
    res.json({ msg: `Rol actualizado a ${role}`, user });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar rol" });
  }
});

// 🔹 Eliminar usuario
router.delete("/users/:id", protect, onlySuperAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
});

// 🔹 Habilitar / deshabilitar periodos
router.put("/periods", protect, onlySuperAdmin, async (req, res) => {
  try {
    let settings = await AppSettings.findOne();
    if (!settings) {
      return res.status(404).json({ msg: "AppSettings no encontrado" });
    }

    settings.periodsOpen = req.body.periodsOpen;
    await settings.save();

    res.json({ msg: "Periodos actualizados", periodsOpen: settings.periodsOpen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar periodos" });
  }
});

router.get("/super-admin-exists", async (req, res) => {
  try {
    const superAdmin = await User.findOne({ role: "SUPER_ADMIN" });

    return res.json({ exists: !!superAdmin });
  } catch (error) {
    console.error("Error verificando SUPER_ADMIN:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener lista de usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

// GET /api/auth/users
router.get("/users", protect, onlySuperAdmin, getAllUsers);

module.exports = router;
