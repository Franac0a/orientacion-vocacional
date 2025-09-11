import { Router } from "express";
import { agregarInscripcion } from "../controllers/inscripcion.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarUsuario, soloUniversidad, agregarInscripcion);

export default router;
