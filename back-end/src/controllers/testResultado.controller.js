import { TestResultModel } from "../models/testResultado.model.js";
import { UserModel } from "../models/user.model.js"; // Asume que este es tu modelo de usuario de Sequelize

export const guardarResultado = async (req, res) => {
  try {
    // En el frontend enviamos { mbtiResult: "TIPO" }. Recibimos esa clave.
    const { mbtiResult } = req.body;

    // El ID del usuario viene del middleware de autenticación (req.usuario.id)
    const userId = req.usuario.id;

    // 1. Validación de datos
    if (!mbtiResult || !userId) {
      return res.status(400).json({ error: "El resultado MBTI es requerido." });
    }

    // 2. Guardar el resultado como un registro histórico (TestResultModel)
    const nuevoResultado = await TestResultModel.create({
      mbti: mbtiResult,
      userId: userId, // Asegúrate de que el campo coincida con la definición en el modelo
    });

    // 3. ¡CRUCIAL! Actualizar el perfil del usuario (UserModel)
    // Esto permite mostrar el resultado directamente en el perfil.
    // Usamos .update() ya que estamos actualizando una instancia existente.
    const [updatedRowsCount] = await UserModel.update(
      { mbtiType: mbtiResult }, // Objeto con los campos a actualizar
      {
        where: { id: userId }, // Condición para encontrar al usuario
      }
    );

    if (updatedRowsCount === 0) {
      // Esto solo debería ocurrir si el usuario no existe, pero el middleware ya lo verificó.
      console.warn(
        `No se encontró el usuario con ID ${userId} para actualizar el MBTI.`
      );
    }

    // 4. Respuesta exitosa
    return res.status(201).json({
      mensaje: "Resultado guardado y perfil actualizado correctamente",
      mbtiType: mbtiResult,
      resultadoId: nuevoResultado.id,
    });
  } catch (error) {
    console.error(
      "Error al guardar el resultado y actualizar el perfil:",
      error
    );
    return res.status(500).json({
      error: "Error interno del servidor al procesar el resultado",
    });
  }
};
