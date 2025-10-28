import { Router } from "express";
import {
  crearCarrera,
  obtenerCarrerasDeUniversidad, // Esta es la de ADMIN
  editarCarrera,
  eliminarCarrera,
  obtenerTodasLasCarrerasPublico, // ¡Necesitamos esta!
} from "../controllers/carrera.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

export const carreraRoutes = Router();

// --- RUTA PÚBLICA (Para el Explorador de "Juan") ---
// GET /api/carreras?area=Tecnología&tipo=Grado
// Esta ruta NO lleva middlewares, es abierta a todos.
carreraRoutes.get("/", obtenerTodasLasCarrerasPublico);

// --- RUTAS DE ADMIN (Para la Universidad logueada) ---

// GET /api/carreras/mis-carreras
// (Movemos la ruta de "obtener mis carreras" aquí para que no choque con "/")
carreraRoutes.get(
  "/mis-carreras",
  verificarUsuario,
  soloUniversidad,
  obtenerCarrerasDeUniversidad
);

// POST /api/carreras
// (Protegida)
carreraRoutes.post("/", verificarUsuario, soloUniversidad, crearCarrera);

// PUT /api/carreras/:id
// (Protegida)
carreraRoutes.put("/:id", verificarUsuario, soloUniversidad, editarCarrera);

// DELETE /api/carreras/:id
// (Protegida)
carreraRoutes.delete(
  "/:id",
  verificarUsuario,
  soloUniversidad,
  eliminarCarrera
);
