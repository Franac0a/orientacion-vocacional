import { Router } from "express";
import {
  crearCarrera,
  obtenerCarrerasDeUniversidad,
} from "../controllers/carrera.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarUsuario, soloUniversidad, crearCarrera);
router.get(
  "/",
  verificarUsuario,
  soloUniversidad,
  obtenerCarrerasDeUniversidad
);

export default router;
