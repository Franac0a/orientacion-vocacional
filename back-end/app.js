import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "./src/config/database.js";
import { authRoutes } from "./src/routes/auth.routes.js";
import { userRoutes } from "./src/routes/user.routes.js";
import { carreraRoutes } from "./src/routes/carrera.routes.js";
import { inscripcionRoutes } from "./src/routes/inscripcion.routes.js";
import { universidadRoutes } from "./src/routes/universidad.routes.js";
import { testResultadoRoutes } from "./src/routes/testResultado.routes.js";

dotenv.config();

const app = express();

app.use(cors());

// Middlewares globales
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carreras", carreraRoutes);
app.use("/api/inscripciones", inscripcionRoutes);
app.use("/api/universidades", universidadRoutes);
app.use("/api", testResultadoRoutes);

// Sincronización de modelos con la base de datos
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("🟢 Base de datos sincronizada correctamente.");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("🔴 Error al sincronizar la base de datos:", error);
  });
