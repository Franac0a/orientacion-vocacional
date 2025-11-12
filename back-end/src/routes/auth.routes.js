import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { verificarUsuario } from "../middlewares/auth.middleware.js";

export const authRoutes = Router();

// Rutas de autenticación
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", verificarUsuario, logout); // Protegemos el logout
