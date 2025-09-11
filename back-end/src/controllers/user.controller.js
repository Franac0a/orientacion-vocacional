import { UserModel } from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const usuario = await UserModel.findByPk(req.usuario.id, {
      attributes: { exclude: ["password"] },
    });

    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado." });

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el perfil.", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await UserModel.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ usuarios });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar usuarios.", error });
  }
};
