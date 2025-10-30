// --- Importaciones ---
import { sequelize } from "./src/config/database.js"; // Ajusta la ruta si es necesario
import { UniversidadModel } from "./src/models/universidades.model.js"; // Ajusta la ruta
import { CarreraModel } from "./src/models/carreras.model.js"; // Ajusta la ruta
import { UserModel } from "./src/models/user.model.js"; // Ajusta la ruta
import { InscripcionModel } from "./src/models/inscripcion.model.js"; // Ajusta la ruta

// --- Datos de Ejemplo ---

// 1. Universidades (Añadidas ISFDAC y UCP)
const universidadesData = [
  {
    nombre: "Universidad Tecnológica Nacional - FRRF",
    alias: "UTN",
    tipo_gestion: "Pública",
    provincia: "Formosa",
    sitio_web: "https://www.frre.utn.edu.ar/",
    userId: 1,
  },
  {
    nombre: "Universidad Nacional de Formosa",
    alias: "UNaF",
    tipo_gestion: "Pública",
    provincia: "Formosa",
    sitio_web: "https://www.unf.edu.ar/",
    userId: 1,
  },
  {
    nombre: "Instituto Politécnico de Formosa",
    alias: "IPF",
    tipo_gestion: "Pública",
    provincia: "Formosa",
    sitio_web: "https://www.ipf.edu.ar/", // Revisa si esta URL es correcta
    userId: 1,
  },
  // --- NUEVAS INSTITUCIONES ---
  {
    nombre: 'Instituto Superior de Formación Docente "Félix Atilio Cabrera"',
    alias: "ISFDAC", // O "Macedo Martínez" si prefieres
    tipo_gestion: "Pública",
    provincia: "Formosa",
    sitio_web: "http://isfdcabrera-for.infd.edu.ar/sitio/", // Revisa si esta URL es correcta
    userId: 1,
  },
  {
    nombre: "Universidad de la Cuenca del Plata - Sede Formosa",
    alias: "UCP",
    tipo_gestion: "Privada",
    provincia: "Formosa",
    sitio_web: "https://ucp.edu.ar/sede-formosa/", // Revisa si esta URL es correcta
    userId: 1,
  },
];

// --- Función para sembrar ---

const sembrarDatos = async () => {
  try {
    // 0. Desactivar y Reactivar Foreign Key Checks
    console.log("Desactivando FOREIGN_KEY_CHECKS...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });

    // Sincronizar BD (¡CON force: true BORRA TODO!)
    console.log("Sincronizando base de datos... (force: true)");
    // await sequelize.sync({ force: true }); // <-- COMENTADO POR SEGURIDAD, DESCOMENTA SI NECESITAS LIMPIAR
    // Si lo descomentas, bórralo o coméntalo de nuevo después de la primera ejecución exitosa.
    console.log("¡Tablas borradas y recreadas! (Si force:true estaba activo)");

    console.log("Reactivando FOREIGN_KEY_CHECKS...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });

    console.log("Conectado a la base de datos...");

    // --- 1. Crear usuario Admin (si no existe) ---
    let adminUser = await UserModel.findOne({ where: { id: 1 } });
    if (!adminUser) {
      console.log("Creando usuario admin de ejemplo...");
      adminUser = await UserModel.create({
        id: 1,
        name: "Admin Impulso",
        email: "admin@impulso.com",
        password: "admin123", // Hashear en producción
        type: "admin",
      });
    }

    // --- 2. Insertar Universidades ---
    console.log("Insertando universidades...");
    // Usar 'ignoreDuplicates: true' por si el script se corre sin force:true
    await UniversidadModel.bulkCreate(universidadesData, {
      ignoreDuplicates: true,
    });

    // --- Obtener IDs después de crear ---
    const uniInstances = await UniversidadModel.findAll({
      where: {
        alias: universidadesData.map((u) => u.alias),
      },
    });
    const getIdByAlias = (alias) => {
      const found = uniInstances.find((u) => u.alias === alias);
      if (!found) throw new Error(`No se encontró ID para ${alias}`);
      return found.id;
    };

    const utnId = getIdByAlias("UTN");
    const unafId = getIdByAlias("UNaF");
    const ipfId = getIdByAlias("IPF");
    const isfdacId = getIdByAlias("ISFDAC"); // <-- Nuevo ID
    const ucpId = getIdByAlias("UCP"); // <-- Nuevo ID
    // --- Fin obtener IDs ---

    // --- 3. Datos de Carreras (Originales + Nuevas) ---
    const carrerasData = [
      // ... (Las 13 carreras anteriores van aquí sin cambios) ...
      // UTN (Originales)
      {
        nombre: "Tecnicatura Superior en Programación",
        descripcion: "Forma programadores para el desarrollo de software.",
        tipo: "Tecnicatura",
        area_estudio: "Tecnología",
        duracion_anios: 2,
        perfiles_mbti_compatibles: JSON.stringify(["ISTP", "INTP", "INTJ"]),
        universidadId: utnId,
      },
      {
        nombre: "Ingeniería Electromecánica",
        descripcion: "Diseño y mantenimiento de sistemas electromecánicos.",
        tipo: "Grado",
        area_estudio: "Ciencias Exactas",
        duracion_anios: 5,
        perfiles_mbti_compatibles: JSON.stringify(["ESTJ", "ISTJ"]),
        universidadId: utnId,
      },
      // UNaF (Originales)
      {
        nombre: "Licenciatura en Sistemas",
        descripcion: "Formación integral en análisis y desarrollo de sistemas.",
        tipo: "Grado",
        area_estudio: "Tecnología",
        duracion_anios: 5,
        perfiles_mbti_compatibles: JSON.stringify(["INTJ", "ENTP", "INTP"]),
        universidadId: unafId,
      },
      {
        nombre: "Enfermería Universitaria",
        descripcion: "Cuidado profesional de la salud.",
        tipo: "Grado",
        area_estudio: "Salud",
        duracion_anios: 4,
        perfiles_mbti_compatibles: JSON.stringify(["ISFJ", "ESFJ", "INFJ"]),
        universidadId: unafId,
      },
      // IPF (Original)
      {
        nombre:
          "Tecnicatura Superior en Desarrollo de Software Multiplataforma",
        descripcion: "Desarrollo de aplicaciones web, móviles y de escritorio.",
        tipo: "Tecnicatura",
        area_estudio: "Tecnología",
        duracion_anios: 3,
        perfiles_mbti_compatibles: JSON.stringify(["INTP", "ENTP", "ISTP"]),
        universidadId: ipfId,
      },
      // UNaF (Añadidas anteriormente)
      {
        nombre: "Licenciatura en Comercio Exterior",
        descripcion: "Gestión de operaciones comerciales internacionales.",
        tipo: "Grado",
        area_estudio: "Ciencias Sociales",
        duracion_anios: 5,
        perfiles_mbti_compatibles: JSON.stringify(["ESTJ", "ENTJ"]),
        universidadId: unafId,
      },
      {
        nombre: "Profesorado en Biología",
        descripcion:
          "Formación docente para nivel secundario y superior en biología.",
        tipo: "Grado",
        area_estudio: "Ciencias Exactas",
        duracion_anios: 4,
        perfiles_mbti_compatibles: JSON.stringify(["ISFJ", "INFJ"]),
        universidadId: unafId,
      },
      {
        nombre: "Tecnicatura en Administración de Empresas Agropecuarias",
        descripcion: "Gestión y administración de emprendimientos rurales.",
        tipo: "Tecnicatura",
        area_estudio: "Ciencias Sociales",
        duracion_anios: 3,
        perfiles_mbti_compatibles: JSON.stringify(["ISTJ", "ESTJ"]),
        universidadId: unafId,
      },
      {
        nombre: "Licenciatura en Psicopedagogía",
        descripcion:
          "Intervención en procesos de aprendizaje y orientación educativa.",
        tipo: "Grado",
        area_estudio: "Humanidades",
        duracion_anios: 5,
        perfiles_mbti_compatibles: JSON.stringify(["INFJ", "ENFJ", "INFP"]),
        universidadId: unafId,
      },
      // UTN-FRRe (Asociadas a UTN Formosa)
      {
        nombre: "Ingeniería Química",
        descripcion: "Diseño y operación de procesos industriales químicos.",
        tipo: "Grado",
        area_estudio: "Ciencias Exactas",
        duracion_anios: 5,
        perfiles_mbti_compatibles: JSON.stringify(["INTJ", "ISTJ", "INTP"]),
        universidadId: utnId,
      },
      {
        nombre: "Tecnicatura Superior en Mecatrónica",
        descripcion:
          "Integración de mecánica, electrónica, informática y control.",
        tipo: "Tecnicatura",
        area_estudio: "Tecnología",
        duracion_anios: 3,
        perfiles_mbti_compatibles: JSON.stringify(["ISTP", "INTP", "ESTJ"]),
        universidadId: utnId,
      },
      // IPF (Añadidas anteriormente)
      {
        nombre: "Tecnicatura Superior en Energías Renovables",
        descripcion:
          "Instalación y mantenimiento de sistemas de energía solar, eólica, etc.",
        tipo: "Tecnicatura",
        area_estudio: "Tecnología",
        duracion_anios: 3,
        perfiles_mbti_compatibles: JSON.stringify(["ISTP", "ESTP", "ISFP"]),
        universidadId: ipfId,
      },
      {
        nombre: "Tecnicatura Superior en Mecatrónica Industrial",
        descripcion: "Automatización y control de procesos industriales.",
        tipo: "Tecnicatura",
        area_estudio: "Tecnología",
        duracion_anios: 3,
        perfiles_mbti_compatibles: JSON.stringify(["ISTP", "ESTJ", "ISTJ"]),
        universidadId: ipfId,
      },

      // --- ¡NUEVAS CARRERAS ISFDAC y UCP! ---
      // ISFDAC
      {
        nombre: "Profesorado de Educación Primaria",
        descripcion: "Formación docente para el nivel primario.",
        tipo: "Grado",
        area_estudio: "Humanidades",
        duracion_anios: 4, // Area: Educación/Humanidades
        perfiles_mbti_compatibles: JSON.stringify(["ESFJ", "ISFJ", "ENFJ"]),
        universidadId: isfdacId,
      },
      {
        nombre: "Profesorado de Educación Secundaria en Matemática",
        descripcion: "Formación docente especializada en matemática.",
        tipo: "Grado",
        area_estudio: "Ciencias Exactas",
        duracion_anios: 4,
        perfiles_mbti_compatibles: JSON.stringify(["ISTJ", "INTJ", "INTP"]),
        universidadId: isfdacId,
      },
      {
        nombre: "Tecnicatura Superior en Bibliotecología",
        descripcion: "Gestión de bibliotecas y centros de documentación.",
        tipo: "Tecnicatura",
        area_estudio: "Humanidades",
        duracion_anios: 3,
        perfiles_mbti_compatibles: JSON.stringify(["ISFJ", "ISTJ", "INFP"]),
        universidadId: isfdacId,
      },
      {
        nombre: "Profesorado de Educación Especial",
        descripcion:
          "Formación para trabajar con alumnos con necesidades educativas especiales.",
        tipo: "Grado",
        area_estudio: "Humanidades",
        duracion_anios: 4, // Area: Educación/Salud/Humanidades
        perfiles_mbti_compatibles: JSON.stringify(["INFJ", "ISFP", "ENFP"]),
        universidadId: isfdacId,
      },
      // UCP
      {
        nombre: "Abogacía",
        descripcion:
          "Formación jurídica integral para el ejercicio de la profesión.",
        tipo: "Grado",
        area_estudio: "Ciencias Sociales",
        duracion_anios: 5,
        perfiles_mbti_compatibles: JSON.stringify([
          "ENTJ",
          "ESTJ",
          "INTJ",
          "ISTJ",
        ]),
        universidadId: ucpId,
      },
      {
        nombre: "Licenciatura en Psicología",
        descripcion:
          "Estudio del comportamiento humano y los procesos mentales.",
        tipo: "Grado",
        area_estudio: "Salud",
        duracion_anios: 5, // Area: Salud/Humanidades
        perfiles_mbti_compatibles: JSON.stringify(["INFJ", "INFP", "ENFJ"]),
        universidadId: ucpId,
      },
      {
        nombre: "Contador Público",
        descripcion:
          "Formación en contabilidad, finanzas, impuestos y auditoría.",
        tipo: "Grado",
        area_estudio: "Ciencias Sociales",
        duracion_anios: 5, // Aprox
        perfiles_mbti_compatibles: JSON.stringify(["ISTJ", "ESTJ"]),
        universidadId: ucpId,
      },
      {
        nombre: "Licenciatura en Nutrición",
        descripcion: "Ciencia de la alimentación y su relación con la salud.",
        tipo: "Grado",
        area_estudio: "Salud",
        duracion_anios: 5, // Aprox
        perfiles_mbti_compatibles: JSON.stringify(["ISFJ", "ESFJ", "ISTJ"]),
        universidadId: ucpId,
      },
    ];

    // --- 4. Insertar Carreras ---
    console.log("Insertando carreras...");
    // Usar 'updateOnDuplicate' para actualizar si ya existen (basado en un unique constraint si lo tuvieras)
    // o simplemente insertar y manejar posibles duplicados si no limpiaste la tabla.
    // Como usamos force:true (o deberíamos haberlo usado), bulkCreate simple debería bastar.
    await CarreraModel.bulkCreate(carrerasData, { ignoreDuplicates: true }); // ignoreDuplicates previene errores si se corre sin limpiar

    console.log("---------------------------------");
    console.log(
      `¡Base de datos sembrada con éxito! (${carrerasData.length} carreras)`
    );
    console.log("---------------------------------");
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error);
    // Asegurarse de reactivar las FK incluso si hay error
    console.log("Intentando reactivar FOREIGN_KEY_CHECKS tras error...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });
  } finally {
    console.log("Cerrando conexión...");
    await sequelize.close();
    console.log("Conexión cerrada.");
  }
};

// --- Ejecutamos la función ---
sembrarDatos();
