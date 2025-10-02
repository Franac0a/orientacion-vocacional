import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const verificarUsuario = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ mensaje: "No hay token, acceso denegado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await UserModel.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({ mensaje: "Usuario no válido." });
    }

    req.usuario = {
      id: usuario.id,
      type: usuario.type,
      email: usuario.email,
    };

    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido o expirado." });
  }
};

export const soloUniversidad = (req, res, next) => {
  try {
    if (req.usuario.type !== "universidad") {
      return res
        .status(403)
        .json({ mensaje: "Solo universidades pueden acceder." });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const soloEstudiante = (req, res, next) => {
  if (req.usuario.type !== "estudiante") {
    return res
      .status(403)
      .json({ mensaje: "Solo estudiantes pueden acceder." });
  }
  next();
};
