import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { UniversidadModel } from "./universidades.model.js";

export const CarreraModel = sequelize.define(
  "Carrera",
  {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    duration: {
      type: DataTypes.STRING(50),
    },
    modality: {
      type: DataTypes.ENUM("presencial", "virtual", "mixta"),
    },
  },
  {
    timestamps: true,
  }
);

// Relaciones
CarreraModel.belongsTo(UniversidadModel, { foreignKey: "universityId" });
UniversidadModel.hasMany(CarreraModel, { foreignKey: "universityId" });
