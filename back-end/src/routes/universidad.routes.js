import { Router } from "express";
import {
  crearUniversidad,
  obtenerMisCarreras,
  obtenerTodasLasUniversidadesPublico, // <-- Importamos la nueva función
} from "../controllers/universidad.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js"; // (Asumo que esta es tu ruta)

export const universidadRoutes = Router();

// --- RUTA PÚBLICA (NUEVA) ---
// GET /api/universidades?search=utn
// Corrección: Usar 'universidadRoutes' en lugar de 'router'
universidadRoutes.get("/", obtenerTodasLasUniversidadesPublico);

// --- RUTAS PROTEGIDAS (ADMIN) ---
universidadRoutes.post(
  "/",
  verificarUsuario,
  soloUniversidad,
  crearUniversidad
);

universidadRoutes.get(
  "/mis-carreras",
  verificarUsuario,
  soloUniversidad,
  obtenerMisCarreras
);
