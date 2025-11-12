import { UserModel } from "../models/user.model.js";

export const obtenerPerfil = async (req, res) => {
  try {
    // El ID del usuario se adjuntó al objeto req por el middleware verificarUsuario
    const userId = req.usuario.id; // Buscar el usuario por ID

    const usuario = await UserModel.findByPk(userId, {
      // Opcional: Excluye datos sensibles como la contraseña
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ error: "Perfil de usuario no encontrado." });
    } // Devolver los datos del perfil

    return res.status(200).json({
      mensaje: "Datos de perfil obtenidos correctamente",
      perfil: {
        id: usuario.id,
        name: usuario.name, // <-- CORREGIDO: Añadido el nombre
        email: usuario.email,
        type: usuario.type, // ¡CORREGIDO! Cambiado de mbtiType a riasecProfile
        riasecProfile: usuario.riasecProfile,
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

// --- NUEVA FUNCIÓN PARA GUARDAR RESULTADO RIASEC ---
export const saveVocationalResult = async (req, res) => {
  // Asumimos que req.usuario.id es inyectado por tu middleware 'verificarUsuario'
  const userId = req.usuario.id;
  const { riasecProfile } = req.body; // Recibimos el nuevo perfil RIASEC

  // Validación simple
  if (
    !riasecProfile ||
    (riasecProfile.length !== 3 && riasecProfile.length !== 0)
  ) {
    return res
      .status(400)
      .json({ message: "Formato de perfil RIASEC inválido." });
  }

  try {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Actualizamos el campo 'riasecProfile' en el usuario
    user.riasecProfile = riasecProfile.toUpperCase();

    await user.save();

    res.status(200).json({
      message: "Resultado vocacional guardado exitosamente.",
      riasecProfile: user.riasecProfile,
    });
  } catch (error) {
    console.error("Error al guardar resultado vocacional:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};
