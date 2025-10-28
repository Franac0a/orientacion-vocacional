// --- Importaciones ---
import { sequelize } from "./src/config/database.js"; // Ajusta la ruta
import { UniversidadModel } from "./src/models/universidades.model.js"; // Ajusta la ruta
import { CarreraModel } from "./src/models/carreras.model.js"; // Ajusta la ruta
import { UserModel } from "./src/models/user.model.js"; // Ajusta la ruta
import { InscripcionModel } from "./src/models/inscripcion.model.js"; // Importamos TODOS los modelos

// --- Datos de Ejemplo ---

// 1. Universidades (¡AHORA SÍ ESTÁN COMPLETOS!)
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
    sitio_web: "https://www.ipf.edu.ar/", // Corregido el 'httpst://'
    userId: 1,
  },
];

// --- Función para sembrar ---

const sembrarDatos = async () => {
  try {
    // --- INICIO DE LA CORRECCIÓN ---
    // Desactivamos temporalmente la revisión de llaves foráneas (solo para MySQL)
    console.log("Desactivando FOREIGN_KEY_CHECKS...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });

    // ¡IMPORTANTE! force: true borra todas las tablas y las recrea.
    // console.log("Sincronizando base de datos... (force: true)");
    await sequelize.sync({ force: true });

    // Reactivamos la revisión de llaves foráneas
    console.log("Reactivando FOREIGN_KEY_CHECKS...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });

    console.log("¡Tablas borradas y recreadas!");
    // --- FIN DE LA CORRECCIÓN ---

    console.log("Conectado a la base de datos...");

    // --- 1. Creamos un usuario Admin de ejemplo ---
    console.log("Creando usuario admin de ejemplo...");

    const adminUser = await UserModel.create({
      id: 1, // Forzamos el ID 1 para que coincida con las universidades
      name: "Admin Impulso",
      email: "admin@impulso.com",
      password: "admin123", // ¡Recuerda hashear esto en tu lógica de auth!
      type: "admin", // O un tipo que permita crear universidades
    });

    // --- 2. Insertamos Universidades ---
    console.log("Insertando universidades...");
    const universidadesCreadas = await UniversidadModel.bulkCreate(
      universidadesData,
      { returning: true }
    );

    // Obtenemos los IDs de las universidades que acabamos de crear
    const utnId = universidadesCreadas.find((u) => u.alias === "UTN").id;
    const unafId = universidadesCreadas.find((u) => u.alias === "UNaF").id;
    const ipfId = universidadesCreadas.find((u) => u.alias === "IPF").id;

    // --- 3. Datos de Carreras (vinculadas a los IDs) ---
    const carrerasData = [
      // UTN
      {
        nombre: "Tecnicatura Superior en Programación",
        descripcion: "Forma programadores para el desarrollo de software.",
        tipo: "Tecnicatura",
        area_estudio: "Tecnología",
        duracion_anios: 2,
        perfiles_mbti_compatibles: ["ISTP", "INTP", "INTJ"],
        universidadId: utnId,
      },
      {
        nombre: "Ingeniería Electromecánica",
        descripcion: "Diseño y mantenimiento de sistemas electromecánicos.",
        tipo: "Grado",
        area_estudio: "Ciencias Exactas",
        duracion_anios: 5,
        perfiles_mbti_compatibles: ["ESTJ", "ISTJ"],
        universidadId: utnId,
      },
      // UNaF
      {
        nombre: "Licenciatura en Sistemas",
        descripcion: "Formación integral en análisis y desarrollo de sistemas.",
        tipo: "Grado",
        area_estudio: "Tecnología",
        duracion_anios: 5,
        perfiles_mbti_compatibles: ["INTJ", "ENTP", "INTP"],
        universidadId: unafId,
      },
      {
        nombre: "Enfermería Universitaria",
        descripcion: "Cuidado profesional de la salud.",
        tipo: "Grado",
        area_estudio: "Salud",
        duracion_anios: 4,
        perfiles_mbti_compatibles: ["ISFJ", "ESFJ", "INFJ"],
        universidadId: unafId,
      },
      // IPF (Ejemplo TSDSM)
      {
        nombre:
          "Tecnicatura Superior en Desarrollo de Software Multiplataforma",
        descripcion: "Desarrollo de aplicaciones web, móviles y de escritorio.",
        tipo: "Tecnicatura",
        area_estudio: "Tecnología",
        duracion_anios: 3,
        perfiles_mbti_compatibles: ["INTP", "ENTP", "ISTP"],
        universidadId: ipfId,
      },
    ];

    // --- 4. Insertamos Carreras ---
    console.log("Insertando carreras...");
    await CarreraModel.bulkCreate(carrerasData);

    console.log("---------------------------------");
    console.log("¡Base de datos sembrada con éxito!");
    console.log("---------------------------------");
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error);
  } finally {
    // Cerramos la conexión a la base de datos
    await sequelize.close();
  }
};

// --- Ejecutamos la función ---
sembrarDatos();
