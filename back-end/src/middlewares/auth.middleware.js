import { verificarToken } from "../helpers/jwt.helper.js";

export const verificarUsuario = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ mensaje: "No hay token, acceso denegado." });

  const datos = verificarToken(token);
  if (!datos)
    return res.status(403).json({ mensaje: "Token inválido o expirado." });

  req.usuario = datos;
  next();
};

export const soloUniversidad = (req, res, next) => {
  if (req.usuario.tipo !== "universidad") {
    return res
      .status(403)
      .json({ mensaje: "Solo universidades pueden acceder." });
  }
  next();
};

export const soloEstudiante = (req, res, next) => {
  if (req.usuario.tipo !== "estudiante") {
    return res
      .status(403)
      .json({ mensaje: "Solo estudiantes pueden acceder." });
  }
  next();
};
