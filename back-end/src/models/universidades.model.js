import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { UserModel } from "./user.model.js";

export const UniversidadModel = sequelize.define(
  "Universidad",
  {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING(50),
    },
    website: {
      type: DataTypes.STRING(255),
    },
  },
  {
    timestamps: true,
  }
);

// Relaciones
UniversidadModel.belongsTo(UserModel, { foreignKey: "userId" });
UserModel.hasOne(UniversidadModel, { foreignKey: "userId" });
