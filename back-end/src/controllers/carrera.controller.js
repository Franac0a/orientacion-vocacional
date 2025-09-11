import { CarreraModel } from "../models/carreras.model.js";
import { UniversidadModel } from "../models/universidades.model.js";

export const crearCarrera = async (req, res) => {
  try {
    const { name, description, duration, modality } = req.body;
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });

    const carrera = await CarreraModel.create({
      name,
      description,
      duration,
      modality,
      universityId: universidad.id,
    });

    res.status(201).json({ mensaje: "Carrera creada exitosamente.", carrera });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear carrera.", error });
  }
};

export const obtenerCarrerasDeUniversidad = async (req, res) => {
  try {
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });

    const carreras = await CarreraModel.findAll({
      where: { universityId: universidad.id },
    });

    res.status(200).json({ carreras });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener carreras.", error });
  }
};
