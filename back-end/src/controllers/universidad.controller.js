import { UniversidadModel } from "../models/universidades.model.js";
import { CarreraModel } from "../models/carreras.model.js";

export const crearUniversidad = async (req, res) => {
  try {
    const { name, address, phone, website } = req.body;

    const universidadExistente = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (universidadExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe una universidad para este usuario." });
    }

    const nuevaUniversidad = await UniversidadModel.create({
      name,
      address,
      phone,
      website,
      userId: req.usuario.id,
    });

    res.status(201).json({
      mensaje: "Universidad creada correctamente.",
      universidad: nuevaUniversidad,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear universidad." });
  }
};

export const obtenerMisCarreras = async (req, res) => {
  try {
    const universityId = req.usuario.id;

    const carreras = await CarreraModel.findAll({
      where: { universityId },
    });

    res.status(200).json(carreras);
  } catch (error) {
    console.error("Error al obtener mis carreras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
