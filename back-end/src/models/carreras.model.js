import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { UniversidadModel } from "./universidades.model.js";

export const CarreraModel = sequelize.define(
  "Carrera",
  {
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    tipo: {
      type: DataTypes.ENUM("Grado", "Tecnicatura", "Posgrado"),
      allowNull: false,
    },
    area_estudio: {
      type: DataTypes.ENUM(
        "Tecnología",
        "Salud",
        "Humanidades",
        "Artes",
        "Ciencias Exactas",
        "Ciencias Sociales"
      ),
      allowNull: false,
    },
    duracion_anios: {
      type: DataTypes.INTEGER,
    },

    perfiles_riasec_compatibles: {
      type: DataTypes.JSON,
      comment: "Perfiles RIASEC (Holland) compatibles con esta carrera.",
    },
  },
  {
    timestamps: true,
  }
);

// --- Relaciones ---
// Una Carrera pertenece a una Universidad
CarreraModel.belongsTo(UniversidadModel, { foreignKey: "universidadId" });
// Una Universidad tiene muchas Carreras
UniversidadModel.hasMany(CarreraModel, { foreignKey: "universidadId" });
