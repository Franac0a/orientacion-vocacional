import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio."),
    body("email").isEmail().withMessage("Email inválido."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres."),
    body("type")
      .isIn(["estudiante", "universidad"])
      .withMessage("Tipo de usuario inválido."),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido."),
    body("password").notEmpty().withMessage("La contraseña es obligatoria."),
  ],
  login
);

router.post("/logout", logout);

export default router;
