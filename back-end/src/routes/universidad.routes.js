import { Router } from "express";
import {
  crearUniversidad,
  obtenerMisCarreras,
  obtenerTodasLasUniversidadesPublico,

  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // Importamos los nombres correctos de tu controlador
  obtenerMiInstitucion,
  actualizarMiInstitucion,
  // --- FIN DE LA CORRECCIÓN ---
} from "../controllers/universidad.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

export const universidadRoutes = Router();

// --- RUTA PÚBLICA ---
universidadRoutes.get("/", obtenerTodasLasUniversidadesPublico);

// --- RUTAS PROTEGIDAS (ADMIN) ---

// POST /api/universidades
universidadRoutes.post(
  "/",
  verificarUsuario,
  soloUniversidad,
  crearUniversidad
);

// --- ¡RUTAS CORREGIDAS CON LOS NOMBRES DE TU CONTROLADOR! ---

// GET /api/universidades/mi-perfil
universidadRoutes.get(
  "/mi-perfil",
  verificarUsuario,
  soloUniversidad,
  obtenerMiInstitucion // <-- Nombre corregido
);

// PUT /api/universidades/mi-perfil
universidadRoutes.put(
  "/mi-perfil",
  verificarUsuario,
  soloUniversidad,
  actualizarMiInstitucion // <-- Nombre corregido (antes era editarMiPerfil)
);

// --- FIN DE RUTAS CORREGIDAS ---

// GET /api/universidades/mis-carreras
// (Esta ruta no la usa el panel, el panel usa /api/carreras/mis-carreras)
universidadRoutes.get(
  "/mis-carreras",
  verificarUsuario,
  soloUniversidad,
  obtenerMisCarreras
);
