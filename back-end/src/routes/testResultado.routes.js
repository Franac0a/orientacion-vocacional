import { Router } from "express";
import { guardarResultado } from "../controllers/testResultado.controller.js";
import { verificarUsuario } from "../middlewares/auth.middleware.js";

export const testResultadoRoutes = Router();

testResultadoRoutes.post(
  "/save-mbti-result",
  verificarUsuario,
  guardarResultado
);
