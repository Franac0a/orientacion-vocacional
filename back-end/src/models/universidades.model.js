import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { UserModel } from "./user.model.js"; // Asumiendo que este modelo existe

export const UniversidadModel = sequelize.define(
  "Universidad",
  {
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING(50), // ej: "UTN", "UBA"
    },
    tipo_gestion: {
      type: DataTypes.ENUM("Pública", "Privada"),
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sitio_web: {
      type: DataTypes.STRING(255),
    },
    // 'userId' (la llave foránea) se crea automáticamente por la relación
  },
  {
    timestamps: true,
  }
);

// --- Relaciones ---
// Una Universidad pertenece a un Usuario (el admin que la cargó)
UniversidadModel.belongsTo(UserModel, { foreignKey: "userId" });
UserModel.hasOne(UniversidadModel, { foreignKey: "userId" });
