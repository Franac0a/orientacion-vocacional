import { UserModel } from "../models/user.model.js";
import { generarToken } from "../helpers/jwt.helper.js";
import {
  encriptarContraseña,
  compararContraseña,
} from "../helpers/bcrypt.helper.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const existe = await UserModel.findOne({ where: { email } });
    if (existe)
      return res.status(400).json({ mensaje: "El usuario ya existe." });

    const hash = await encriptarContraseña(password);
    const nuevoUsuario = await UserModel.create({
      name,
      email,
      password: hash,
      type,
    });

    const token = generarToken({
      id: nuevoUsuario.id,
      type: nuevoUsuario.type,
    });
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el registro.", error });
  }
};

// En tu controlador de login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await UserModel.findOne({ where: { email } });
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado." });

    const valido = await compararContraseña(password, usuario.password);
    if (!valido)
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });

    const token = generarToken({ id: usuario.id, type: usuario.type });
    res.cookie("token", token, { httpOnly: true });

    // La respuesta a enviar
    const responseData = {
      mensaje: "Login exitoso.",
      user: {
        id: usuario.id,
        email: usuario.email,
        type: usuario.type, // <-- Revisa si esta propiedad está definida
      },
      token: token,
    };

    // Esto te permitirá ver la respuesta completa en la consola del servidor
    console.log("Respuesta del servidor:", responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error en el login:", error); // Muestra el error en la consola
    res.status(500).json({ mensaje: "Error en el login.", error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ mensaje: "Logout exitoso." });
};
