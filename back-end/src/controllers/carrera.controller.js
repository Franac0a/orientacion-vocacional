import { CarreraModel } from "../models/carreras.model.js";
import { UniversidadModel } from "../models/universidades.model.js";
import { Op } from "sequelize"; // Asegúrate de importar 'Op'

// --- Controladores de ADMIN ---
export const crearCarrera = async (req, res) => {
  /* ... */
  try {
    // Usamos nuestros campos
    const {
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      perfiles_mbti_compatibles,
    } = req.body;

    // 1. Encontrar la universidad del usuario logueado
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });

    // 2. Crear la carrera vinculada a esa universidad
    const carrera = await CarreraModel.create({
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      // Asegurarse de guardar como JSON string si el modelo es TEXT, o directo si es JSON nativo
      perfiles_mbti_compatibles: Array.isArray(perfiles_mbti_compatibles)
        ? JSON.stringify(perfiles_mbti_compatibles)
        : perfiles_mbti_compatibles,
      universidadId: universidad.id, // Vinculamos
    });

    res.status(201).json({ mensaje: "Carrera creada exitosamente.", carrera });
  } catch (error) {
    console.error("Error al crear carrera:", error); // Añadir log
    res
      .status(500)
      .json({ mensaje: "Error al crear carrera.", error: error.message });
  }
};
export const obtenerCarrerasDeUniversidad = async (req, res) => {
  /* ... */
  try {
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });

    const carreras = await CarreraModel.findAll({
      where: { universidadId: universidad.id },
      include: {
        // Incluir universidad por si acaso se necesita en el dashboard
        model: UniversidadModel,
        attributes: ["nombre"], // Solo el nombre
      },
    });

    res.status(200).json(carreras);
  } catch (error) {
    console.error("Error al obtener carreras de la universidad:", error); // Añadir log
    res
      .status(500)
      .json({ mensaje: "Error al obtener carreras.", error: error.message });
  }
};
export const editarCarrera = async (req, res) => {
  /* ... */
  try {
    const { id } = req.params; // ID de la Carrera a editar
    const {
      nombre,
      descripcion,
      tipo,
      area_estudio,
      duracion_anios,
      perfiles_mbti_compatibles,
    } = req.body;

    // 1. Encontrar la universidad del usuario
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });
    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });

    // 2. Encontrar la carrera
    const carrera = await CarreraModel.findOne({
      where: {
        id: id,
        universidadId: universidad.id, // Asegurarnos que la carrera es de su universidad
      },
    });

    if (!carrera) {
      return res.status(404).json({
        mensaje: "Carrera no encontrada o no pertenece a esta universidad.",
      });
    }

    // 3. Actualizar campos
    carrera.nombre = nombre !== undefined ? nombre : carrera.nombre;
    carrera.descripcion =
      descripcion !== undefined ? descripcion : carrera.descripcion;
    carrera.tipo = tipo !== undefined ? tipo : carrera.tipo;
    carrera.area_estudio =
      area_estudio !== undefined ? area_estudio : carrera.area_estudio;
    carrera.duracion_anios =
      duracion_anios !== undefined ? duracion_anios : carrera.duracion_anios;
    if (perfiles_mbti_compatibles !== undefined) {
      carrera.perfiles_mbti_compatibles = Array.isArray(
        perfiles_mbti_compatibles
      )
        ? JSON.stringify(perfiles_mbti_compatibles)
        : perfiles_mbti_compatibles;
    }

    await carrera.save();

    res.status(200).json(carrera);
  } catch (error) {
    console.error("Error al editar carrera:", error); // Añadir log
    res
      .status(500)
      .json({ error: "Error interno del servidor", details: error.message });
  }
};
export const eliminarCarrera = async (req, res) => {
  /* ... */
  try {
    const { id } = req.params; // ID de la Carrera a eliminar

    // 1. Encontrar la universidad del usuario
    const universidad = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });
    if (!universidad)
      return res.status(404).json({ mensaje: "Universidad no encontrada." });

    // 2. Encontrar y verificar la carrera
    const carrera = await CarreraModel.findOne({
      where: {
        id: id,
        universidadId: universidad.id, // Seguridad: solo puede borrar sus carreras
      },
    });

    if (!carrera) {
      return res.status(404).json({
        mensaje: "Carrera no encontrada o no pertenece a esta universidad.",
      });
    }

    // 3. Eliminar
    await carrera.destroy();

    res.status(200).json({ mensaje: "Carrera eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar carrera:", error); // Añadir log
    res
      .status(500)
      .json({ error: "Error interno del servidor", details: error.message });
  }
};

// --- CONTROLADOR PÚBLICO (LIKE SIMPLIFICADO) ---
export const obtenerTodasLasCarrerasPublico = async (req, res) => {
  try {
    const { area, tipo, provincia, search, mbti } = req.query;

    const filtroCarrera = {};
    if (area) filtroCarrera.area_estudio = area;
    if (tipo) filtroCarrera.tipo = tipo;
    if (search) {
      filtroCarrera[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }
    // --- LÓGICA MBTI SIMPLIFICADA ---
    if (mbti) {
      const mbtiUpper = mbti.toUpperCase();
      // Buscamos simplemente si el string MBTI aparece en cualquier parte
      filtroCarrera.perfiles_mbti_compatibles = {
        [Op.like]: `%${mbtiUpper}%`, // Busca ej: %INTJ%
      };
      console.log(`---> Buscando MBTI LIKE simplificado: %${mbtiUpper}%`); // Log añadido
    }
    // --- FIN LÓGICA MBTI ---

    const filtroUniversidad = {};
    if (provincia) {
      filtroUniversidad.provincia = { [Op.like]: `%${provincia}%` };
    }

    console.log(
      "Filtro Carreras Construido:",
      JSON.stringify(filtroCarrera, null, 2)
    );
    console.log(
      "Filtro Universidad Construido:",
      JSON.stringify(filtroUniversidad, null, 2)
    );

    const carreras = await CarreraModel.findAll({
      where: filtroCarrera,
      include: {
        model: UniversidadModel,
        attributes: ["nombre", "provincia", "tipo_gestion", "sitio_web"],
        where: filtroUniversidad,
        required: provincia ? true : false,
      },
      order: [["nombre", "ASC"]],
    });

    console.log(`Carreras encontradas para mbti=${mbti}: ${carreras.length}`);

    res.json(carreras);
  } catch (error) {
    console.error("Error al obtener carreras públicas:", error);
    res
      .status(500)
      .json({ message: "Error al obtener carreras", error: error.message });
  }
};
