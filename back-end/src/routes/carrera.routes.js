import { Router } from "express";
import {
  crearCarrera,
  obtenerCarrerasDeUniversidad,
  editarCarrera,
  eliminarCarrera,
} from "../controllers/carrera.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

export const carreraRoutes = Router();

carreraRoutes.post("/", verificarUsuario, soloUniversidad, crearCarrera);
carreraRoutes.get(
  "/",
  verificarUsuario,
  soloUniversidad,
  obtenerCarrerasDeUniversidad
);
carreraRoutes.put("/:id", verificarUsuario, soloUniversidad, editarCarrera);
carreraRoutes.delete(
  "/:id",
  verificarUsuario,
  soloUniversidad,
  eliminarCarrera
);
