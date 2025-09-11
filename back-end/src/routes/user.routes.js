import { Router } from "express";
import { getProfile, getAllUsers } from "../controllers/user.controller.js";
import { verificarUsuario } from "../middlewares/auth.middleware.js";

const router = Router();

// Obtener perfil del usuario autenticado
router.get("/profile", verificarUsuario, getProfile);

// Listar todos los usuarios (opcional, solo si lo necesitás)
router.get("/", verificarUsuario, getAllUsers);

export default router;
