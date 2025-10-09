import { UserModel } from "../models/user.model.js";

export const obtenerPerfil = async (req, res) => {
  try {
    // El ID del usuario se adjuntó al objeto req por el middleware verificarUsuario
    const userId = req.usuario.id;

    // Buscar el usuario por ID
    const usuario = await UserModel.findByPk(userId, {
      // Opcional: Excluye datos sensibles como la contraseña
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ error: "Perfil de usuario no encontrado." });
    }

    // Devolver los datos del perfil
    return res.status(200).json({
      mensaje: "Datos de perfil obtenidos correctamente",
      perfil: {
        id: usuario.id,
        email: usuario.email,
        type: usuario.type,
        // ¡Este es el dato que queremos mostrar!
        mbtiType: usuario.mbtiType,
        // ...otros campos
      },
    });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
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
