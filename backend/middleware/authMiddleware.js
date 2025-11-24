import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "No autorizado - Sin token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SIEMPRE traer al usuario de la BD
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: "No autorizado - Usuario no encontrado" });
    }

    // AQUI asocias el usuario real, NO los datos del token
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Token inválido" });
  }
};
