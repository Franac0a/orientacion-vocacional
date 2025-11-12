import { UniversidadModel } from "../models/universidades.model.js";
import { CarreraModel } from "../models/carreras.model.js";
import { Op } from "sequelize";

export const crearUniversidad = async (req, res) => {
  try {
    const { nombre, alias, tipo_gestion, provincia, sitio_web } = req.body;

    // --- ¡CORRECCIÓN DEVUELTA A "req.usuario"! ---
    const userId = req.usuario.id;

    const universidadExistente = await UniversidadModel.findOne({
      where: { userId: userId },
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
      userId: userId,
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
    const universidad = await UniversidadModel.findOne({
      // --- ¡CORRECCIÓN DEVUELTA A "req.usuario"! ---
      where: { userId: req.usuario.id },
    });

    if (!universidad) {
      return res.status(404).json({ mensaje: "Universidad no encontrada." });
    }

    const carreras = await CarreraModel.findAll({
      where: { universidadId: universidad.id },
    });

    res.json(carreras);
  } catch (error) {
    console.error("Error al obtener mis carreras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerTodasLasUniversidadesPublico = async (req, res) => {
  try {
    const { search } = req.query;

    const filtro = {};

    if (search) {
      filtro[Op.or] = [
        {
          nombre: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          alias: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          provincia: {
            [Op.like]: `%${search}%`,
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

// --- ¡NUEVAS FUNCIONES PARA EL DASHBOARD! ---

export const obtenerMiInstitucion = async (req, res) => {
  try {
    // --- ¡CORRECCIÓN DEVUELTA A "req.usuario"! ---
    // Esta era la línea 119 que causaba el crash
    const userId = req.usuario.id;

    const institucion = await UniversidadModel.findOne({
      where: { userId: userId },
    });

    if (!institucion) {
      return res.status(404).json({
        mensaje: "El perfil de la institución aún no ha sido creado.",
      });
    }

    res.status(200).json({ institucion: institucion });
  } catch (error) {
    // --- Log de error mejorado ---
    console.error("Error al obtener perfil de institución:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

export const actualizarMiInstitucion = async (req, res) => {
  try {
    // --- ¡CORRECCIÓN DEVUELTA A "req.usuario"! ---
    const userId = req.usuario.id;
    const { nombre, alias, tipo_gestion, provincia, sitio_web } = req.body;

    const institucion = await UniversidadModel.findOne({
      where: { userId: userId },
    });

    if (!institucion) {
      return res
        .status(4404) // Corregido a 404
        .json({
          mensaje:
            "No se encontró el perfil de la institución para actualizar.",
        });
    }

    institucion.nombre = nombre || institucion.nombre;
    institucion.alias = alias || institucion.alias;
    institucion.tipo_gestion = tipo_gestion || institucion.tipo_gestion;
    institucion.provincia = provincia || institucion.provincia;
    institucion.sitio_web = sitio_web || institucion.sitio_web;

    await institucion.save();

    res.status(200).json({
      mensaje: "Perfil de la institución actualizado correctamente.",
      institucion: institucion,
    });
  } catch (error) {
    console.error("Error al actualizar perfil de institución:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
