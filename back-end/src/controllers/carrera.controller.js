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

export const editarCarrera = async (req, res) => {
  try {
    const universityId = req.usuario.id;
    const { id } = req.params;
    const { name, description, duration, modality } = req.body;

    const carrera = await CarreraModel.findOne({
      where: { id, universityId },
    });

    if (!carrera) {
      return res.status(404).json({
        mensaje: "Carrera no encontrada o no pertenece a esta universidad.",
      });
    }

    carrera.name = name || carrera.name;
    carrera.description = description || carrera.description;
    carrera.duration = duration || carrera.duration;
    carrera.modality = modality || carrera.modality;

    await carrera.save();

    res.status(200).json(carrera);
  } catch (error) {
    console.error("Error al editar carrera:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarCarrera = async (req, res) => {
  try {
    const universityId = req.usuario.id;
    const { id } = req.params;

    const carrera = await CarreraModel.findOne({
      where: { id, universityId },
    });

    if (!carrera) {
      return res
        .status(404)
        .json({
          mensaje: "Carrera no encontrada o no pertenece a esta universidad.",
        });
    }

    await carrera.destroy();

    res.status(200).json({ mensaje: "Carrera eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar carrera:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
