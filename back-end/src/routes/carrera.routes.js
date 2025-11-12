import { Router } from "express";
import {
  crearCarrera,
  obtenerCarrerasDeUniversidad, // Esta es la de ADMIN
  editarCarrera,
  eliminarCarrera,
  obtenerTodasLasCarrerasPublico,
} from "../controllers/carrera.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

export const carreraRoutes = Router();

// --- RUTA PÚBLICA (Para el Explorador de "Juan") ---
// GET /api/carreras?area=Tecnología&tipo=Grado
carreraRoutes.get("/", obtenerTodasLasCarrerasPublico);

// --- RUTAS DE ADMIN (Para la Universidad logueada) ---

// GET /api/carreras/mis-carreras
// (Esta es la que llama el panel para MOSTRAR la tabla de carreras)
carreraRoutes.get(
  "/mis-carreras",
  verificarUsuario,
  soloUniversidad,
  obtenerCarrerasDeUniversidad
);

// POST /api/carreras
// (Esta es la que llama el panel para CREAR una carrera)
// --- ¡RUTA CORREGIDA! (antes decía "/carreras") ---
carreraRoutes.post("/", verificarUsuario, soloUniversidad, crearCarrera);

// PUT /api/carreras/:id
// (Para Editar)
carreraRoutes.put("/:id", verificarUsuario, soloUniversidad, editarCarrera);

// DELETE /api/carreras/:id
// (Para Eliminar)
carreraRoutes.delete(
  "/:id",
  verificarUsuario,
  soloUniversidad,
  eliminarCarrera
);
