import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { UserModel } from "./user.model.js";

export const TestResultModel = sequelize.define(
  "TestResult",
  {
    mbti: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    mbtiType: {
      // ¡Asegúrate de incluir este campo!
      type: DataTypes.STRING(10),
      allowNull: true, // Puede ser nulo si el usuario aún no ha hecho el test
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

TestResultModel.belongsTo(UserModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
UserModel.hasMany(TestResultModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
