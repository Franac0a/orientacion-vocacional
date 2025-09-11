import { Router } from "express";
import { crearUniversidad } from "../controllers/universidad.controller.js";
import {
  verificarUsuario,
  soloUniversidad,
} from "../middlewares/auth.middleware.js";

export const universidadRoutes = Router();

universidadRoutes.post(
  "/",
  verificarUsuario,
  soloUniversidad,
  crearUniversidad
);
