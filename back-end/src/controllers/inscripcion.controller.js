import { InscripcionModel } from "../models/inscripcion.model.js";
import { CarreraModel } from "../models/carreras.model.js";
import { UniversidadModel } from "../models/universidades.model.js";

export const agregarInscripcion = async (req, res) => {
  try {
    const { careerId, startDate, endDate, schedule, requirements } = req.body;

    const carrera = await CarreraModel.findByPk(careerId);
    if (!carrera)
      return res.status(404).json({ mensaje: "Carrera no encontrada." });

    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });
    if (carrera.universityId !== universidad.id) {
      return res
        .status(403)
        .json({ mensaje: "No tenés permiso para modificar esta carrera." });
    }

    const inscripcion = await InscripcionModel.create({
      careerId,
      startDate,
      endDate,
      schedule,
      requirements,
    });

    res
      .status(201)
      .json({ mensaje: "Información de inscripción agregada.", inscripcion });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar inscripción.", error });
  }
};
