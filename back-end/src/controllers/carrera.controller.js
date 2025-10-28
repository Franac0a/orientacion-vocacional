import { CarreraModel } from "../models/carreras.model.js";
import { UniversidadModel } from "../models/universidades.model.js";
// Importamos Op, y TAMBIÉN fn y col para funciones de BD
import { Op, fn, col } from "sequelize";
import Sequelize from "sequelize";

// --- Crear una carrera --- (Tu código existente)
export const crearCarrera = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      perfiles_mbti_compatibles,
    } = req.body;
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });
    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });
    const carrera = await CarreraModel.create({
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      perfiles_mbti_compatibles,
      universidadId: universidad.id,
    });
    res.status(201).json({ mensaje: "Carrera creada exitosamente.", carrera });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear carrera.", error });
  }
};

// --- Obtener carreras de MI universidad --- (Tu código existente)
export const obtenerCarrerasDeUniversidad = async (req, res) => {
  try {
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });
    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });
    const carreras = await CarreraModel.findAll({
      where: { universidadId: universidad.id },
    });
    res.status(200).json(carreras);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener carreras.", error });
  }
};

// --- Editar una carrera --- (Tu código existente)
export const editarCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      perfiles_mbti_compatibles,
    } = req.body;
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });
    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });
    const carrera = await CarreraModel.findOne({
      where: {
        id: id,
        universidadId: universidad.id,
      },
    });
    if (!carrera) {
      return res.status(404).json({
        mensaje: "Carrera no encontrada o no pertenece a esta universidad.",
      });
    }
    carrera.nombre = nombre || carrera.nombre;
    carrera.descripcion = descripcion || carrera.descripcion;
    carrera.tipo = tipo || carrera.tipo;
    carrera.area_estudio = area_estudio || carrera.area_estudio;
    carrera.duracion_anios = duracion_anios || carrera.duracion_anios;
    carrera.perfiles_mbti_compatibles =
      perfiles_mbti_compatibles || carrera.perfiles_mbti_compatibles;
    await carrera.save();
    res.status(200).json(carrera);
  } catch (error) {
    console.error("Error al editar carrera:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// --- Eliminar una carrera --- (Tu código existente)
export const eliminarCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });
    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });
    const carrera = await CarreraModel.findOne({
      where: {
        id: id,
        universidadId: universidad.id,
      },
    });
    if (!carrera) {
      return res.status(404).json({
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

// --- OBTENER TODAS LAS CARRERAS (PÚBLICO) --- (¡MODIFICADO!)
export const obtenerTodasLasCarrerasPublico = async (req, res) => {
  try {
    // Obtenemos TODOS los filtros posibles
    const { area, tipo, provincia, search, mbti } = req.query; // <-- Añadimos 'mbti'

    // Construimos el 'where' para Carreras
    const filtroCarrera = {};
    if (area) {
      filtroCarrera.area_estudio = area;
    }
    if (tipo) {
      filtroCarrera.tipo = tipo;
    }
    if (search) {
      // Búsqueda por nombre o descripción
      filtroCarrera[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    // --- ¡NUEVA LÓGICA PARA FILTRO MBTI! ---
    if (mbti) {
      // Usamos la función JSON_CONTAINS de MySQL
      // Buscamos si el array 'perfiles_mbti_compatibles' contiene el string 'mbti'
      // Es importante pasar el mbti como un string JSON válido (entre comillas dobles)
      filtroCarrera[Op.and] = // Usamos Op.and para añadir esta condición a las existentes
        Sequelize.where(
          fn("JSON_CONTAINS", col("perfiles_mbti_compatibles"), `"${mbti}"`),
          true
        );
      // Esto se traduce a: WHERE JSON_CONTAINS(perfiles_mbti_compatibles, '"INTJ"') = TRUE
    }
    // --- FIN LÓGICA MBTI ---

    // Construimos el 'where' para Universidades (si hay filtro de provincia)
    const filtroUniversidad = {};
    if (provincia) {
      filtroUniversidad.provincia = provincia;
    }

    // Buscamos en la BD
    const carreras = await CarreraModel.findAll({
      where: filtroCarrera, // Filtros de la carrera (incluye MBTI si existe)
      include: {
        model: UniversidadModel,
        attributes: ["nombre", "provincia", "tipo_gestion", "sitio_web"],
        where: filtroUniversidad, // Filtros de la universidad
        required: true, // INNER JOIN
      },
    });

    res.json(carreras);
  } catch (error) {
    // Añadimos un log más detallado en caso de error
    console.error("Error detallado al obtener carreras públicas:", error);
    res
      .status(500)
      .json({ message: "Error al obtener carreras", error: error.message });
  }
};
