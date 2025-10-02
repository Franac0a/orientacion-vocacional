import { TestResultModel } from "../models/testResultado.model.js";
import { UserModel } from "../models/user.model.js";

export const guardarResultado = async (req, res) => {
  try {
    const { mbti } = req.body;
    const userId = req.usuario.id;

    if (!mbti || !userId) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const nuevoResultado = await TestResultModel.create({
      mbti,
      userId,
    });

    return res.status(201).json({
      mensaje: "Resultado guardado correctamente",
      resultado: nuevoResultado,
    });
    comsole.log("llego");
  } catch (error) {
    console.error("Error al guardar el resultado:", error);
    return res.status(500).json({
      error: "Error al guardar el resultado",
    });
  }
};
