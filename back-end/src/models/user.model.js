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
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("estudiante", "universidad"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
