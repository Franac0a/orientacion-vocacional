import { Router } from "express";
import { verificarUsuario } from "../middlewares/auth.middleware.js";
import {
  obtenerPerfil,
  getAllUsers,
  saveVocationalResult,
} from "../controllers/user.controller.js"; // <-- Importamos las 3 funciones

export const userRoutes = Router();

userRoutes.use(verificarUsuario);

// --- RUTA PARA PERFIL ---
// GET /api/users/perfil
// (Tu perfil.js llama a esta ruta)
userRoutes.get("/perfil", obtenerPerfil);

// --- RUTA PARA GUARDAR TEST ---
// POST /api/users/save-vocational-result
// (Tu test.js llamará a esta ruta)
userRoutes.post("/save-vocational-result", saveVocationalResult);

// --- RUTA ADICIONAL ---
// GET /api/users/
// (Tu user.controller.js ya tiene esta función)
userRoutes.get("/", getAllUsers);
