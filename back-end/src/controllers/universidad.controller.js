import { UniversidadModel } from "../models/universidades.model.js";
import { CarreraModel } from "../models/carreras.model.js";
import { Op } from "sequelize"; // ¡Importante para la búsqueda!

export const crearUniversidad = async (req, res) => {
  // ... (tu código existente de crearUniversidad) ...
  try {
    // Usamos nuestros campos: nombre, alias, tipo_gestion, provincia, sitio_web
    const { nombre, alias, tipo_gestion, provincia, sitio_web } = req.body;

    const universidadExistente = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (universidadExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe una universidad para este usuario." });
    }

    const nuevaUniversidad = await UniversidadModel.create({
      nombre,
      alias,
      tipo_gestion,
      provincia,
      sitio_web,
      userId: req.usuario.id, // Vinculamos al usuario logueado
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
  // ... (tu código existente de obtenerMisCarreras) ...
  try {
    // 1. Encontrar la universidad del usuario
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (!universidad) {
      return res.status(404).json({ mensaje: "Universidad no encontrada." });
    }

    // 2. Buscar las carreras de esa universidad
    const carreras = await CarreraModel.findAll({
      where: { universidadId: universidad.id },
    });

    res.status(200).json(carreras);
  } catch (error) {
    console.error("Error al obtener mis carreras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// --- ¡NUEVA FUNCIÓN PÚBLICA! ---
// --- OBTENER TODAS LAS UNIVERSIDADES (PÚBLICO) ---
export const obtenerTodasLasUniversidadesPublico = async (req, res) => {
  try {
    const { search } = req.query;

    const filtro = {};

    // Lógica de búsqueda (similar a la de carreras)
    if (search) {
      filtro[Op.or] = [
        {
          nombre: {
            [Op.like]: `%${search}%`, // Buscar en el nombre
          },
        },
        {
          alias: {
            [Op.like]: `%${search}%`, // O buscar en el alias (ej: "UTN")
          },
        },
        {
          provincia: {
            [Op.like]: `%${search}%`, // O buscar en la provincia
          },
        },
      ];
    }

    const universidades = await UniversidadModel.findAll({
      where: filtro,
    });

    res.json(universidades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener universidades", error });
  }
};
