import { CarreraModel } from "../models/carreras.model.js";
import { UniversidadModel } from "../models/universidades.model.js";
import { Op } from "sequelize";

// --- LÓGICA PARA EL PANEL DE ADMIN ---

/**
 * CREAR UNA NUEVA CARRERA
 * Vinculada a la institución del usuario logueado.
 */
export const crearCarrera = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      perfiles_riasec_compatibles,
      institucion_id, // ¡Lo recibimos del frontend!
    } = req.body;

    const userId = req.usuario.id; // ID del usuario logueado

    // 1. Validar que recibimos el ID de la institución
    if (!institucion_id) {
      return res.status(400).json({
        mensaje: "Error: No se proporcionó un ID de institución.",
      });
    }

    // 2. Buscar la institución
    const institucion = await UniversidadModel.findByPk(institucion_id);
    if (!institucion) {
      return res.status(404).json({ mensaje: "Institución no encontrada." });
    }

    // 3. ¡Chequeo de seguridad!
    // Verificar que la institución le pertenece al usuario logueado.
    if (institucion.userId !== userId) {
      return res.status(403).json({
        mensaje: "No tienes permiso para añadir carreras a esta institución.",
      });
    }

    // 4. Crear la carrera y vincularla
    const nuevaCarrera = await CarreraModel.create({
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      perfiles_riasec_compatibles,
      universidadId: institucion.id, // ¡La vinculamos con el ID correcto!
    });

    res.status(201).json(nuevaCarrera);
  } catch (error) {
    console.error("Error al crear carrera:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

/**
 * OBTENER "MIS CARRERAS"
 * Trae solo las carreras de la institución del usuario logueado.
 */
export const obtenerCarrerasDeUniversidad = async (req, res) => {
  try {
    const userId = req.usuario.id;

    // 1. Encontrar la universidad del usuario
    const institucion = await UniversidadModel.findOne({
      where: { userId: userId },
    });

    if (!institucion) {
      // Si no tiene perfil de institución, no puede tener carreras
      return res
        .status(404)
        .json({ mensaje: "Perfil de institución no encontrado." });
    }

    // 2. Buscar las carreras de ESA universidad
    const carreras = await CarreraModel.findAll({
      where: { universidadId: institucion.id },
    });

    res.status(200).json(carreras);
  } catch (error) {
    console.error("Error al obtener 'mis carreras':", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

/**
 * EDITAR UNA CARRERA
 * Verifica que la carrera pertenezca al usuario logueado.
 */
export const editarCarrera = async (req, res) => {
  try {
    const { id } = req.params; // ID de la carrera
    const userId = req.usuario.id; // ID del usuario
    const datosNuevos = req.body;

    // 1. Buscar la carrera
    const carrera = await CarreraModel.findByPk(id);
    if (!carrera) {
      return res.status(404).json({ mensaje: "Carrera no encontrada." });
    }

    // 2. Verificar permisos (Chequeo de seguridad)
    const institucion = await UniversidadModel.findByPk(carrera.universidadId);
    if (!institucion || institucion.userId !== userId) {
      return res.status(403).json({
        mensaje: "No tienes permiso para editar esta carrera.",
      });
    }

    // 3. Actualizar
    await carrera.update(datosNuevos);
    res.status(200).json({ mensaje: "Carrera actualizada", carrera });
  } catch (error) {
    console.error("Error al editar carrera:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

/**
 * ELIMINAR UNA CARRERA
 * Verifica que la carrera pertenezca al usuario logueado.
 */
export const eliminarCarrera = async (req, res) => {
  try {
    const { id } = req.params; // ID de la carrera
    const userId = req.usuario.id; // ID del usuario

    // 1. Buscar la carrera
    const carrera = await CarreraModel.findByPk(id);
    if (!carrera) {
      return res.status(404).json({ mensaje: "Carrera no encontrada." });
    }

    // 2. Verificar permisos (Chequeo de seguridad)
    const institucion = await UniversidadModel.findByPk(carrera.universidadId);
    if (!institucion || institucion.userId !== userId) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar esta carrera.",
      });
    }

    // 3. Eliminar
    await carrera.destroy();
    res.status(200).json({ mensaje: "Carrera eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar carrera:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// --- LÓGICA PARA LA BÚSQUEDA PÚBLICA ---

/**
 * OBTENER TODAS LAS CARRERAS (PÚBLICO)
 * Filtra por área, tipo, etc.
 */
export const obtenerTodasLasCarrerasPublico = async (req, res) => {
  try {
    const { area, tipo, search } = req.query;
    const filtro = {};

    if (area) filtro.area_estudio = area;
    if (tipo) filtro.tipo = tipo;
    if (search) {
      filtro.nombre = { [Op.like]: `%${search}%` };
    }

    const carreras = await CarreraModel.findAll({
      where: filtro,
      include: {
        model: UniversidadModel,
        attributes: ["nombre", "alias", "provincia", "tipo_gestion"],
      },
    });

    res.status(200).json(carreras);
  } catch (error) {
    console.error("Error al obtener carreras públicas:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
