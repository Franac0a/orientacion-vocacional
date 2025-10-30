import { Router } from "express";

// --- Importamos los controladores de universidad ---
import {
  crearUniversidad,
  obtenerMisCarreras,
} from "../controllers/universidad.controller.js";

// --- Importamos los middlewares ---
import { verificarUsuario } from "../middleware/verificarUsuario.js";
import { soloUniversidad } from "../middleware/soloUniversidad.js";

const router = Router();

// --- RUTAS PROTEGIDAS (Solo para Universidades) ---

// POST /api/universidades
// Para que un usuario "universidad" cree su perfil
router.post("/", [verificarUsuario, soloUniversidad], crearUniversidad);

// GET /api/universidades/mis-carreras
// Para que la U. vea las carreras que ha cargado
router.get(
  "/mis-carreras",
  [verificarUsuario, soloUniversidad],
  obtenerMisCarreras
);

export default router;
