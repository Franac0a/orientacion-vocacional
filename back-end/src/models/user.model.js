import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const UserModel = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("estudiante", "universidad", "admin"),
      allowNull: false,
    },
    riasecProfile: {
      type: DataTypes.STRING(3),
      defaultValue: null,
      comment: "Código RIASEC (Holland) principal del usuario (ej. SAI)",
    },
  },
  {
    timestamps: true,
  }
);

// Aquí irían las relaciones del usuario, por ejemplo con UniversidadModel
// (basado en tu código anterior)
// UniversidadModel.belongsTo(UserModel, { foreignKey: "userId" });
// UserModel.hasOne(UniversidadModel, { foreignKey: "userId" });
