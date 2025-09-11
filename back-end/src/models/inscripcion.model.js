import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { CarreraModel } from "./carreras.model.js";

export const InscripcionModel = sequelize.define(
  "Inscripcion",
  {
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    schedule: {
      type: DataTypes.TEXT,
    },
    requirements: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

// Relaciones
InscripcionModel.belongsTo(CarreraModel, { foreignKey: "careerId" });
CarreraModel.hasOne(InscripcionModel, { foreignKey: "careerId" });
