import { Router } from "express";
import { agregarInscripcion } from "../controllers/inscripcion.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

export const inscripcionRoutes = Router();

inscripcionRoutes.post(
  "/",
  verificarUsuario,
  soloUniversidad,
  agregarInscripcion
);
