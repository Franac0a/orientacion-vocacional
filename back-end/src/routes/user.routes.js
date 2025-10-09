import { Router } from "express";
import { obtenerPerfil, getAllUsers } from "../controllers/user.controller.js";
import { verificarUsuario } from "../middlewares/auth.middleware.js";

export const userRoutes = Router();

// Obtener perfil del usuario autenticado
userRoutes.get("/profile", verificarUsuario, obtenerPerfil);

// Listar todos los usuarios (opcional, solo si lo necesitás)
userRoutes.get("/", verificarUsuario, getAllUsers);
