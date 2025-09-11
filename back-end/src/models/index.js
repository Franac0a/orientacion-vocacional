import { sequelize } from "../config/database.js";

// Importación de modelos
import { UserModel } from "./user.model.js";
import { UniversidadModel } from "./universidades.model.js";
import { CarreraModel } from "./carreras.model.js";
import { InscripcionModel } from "./inscripcion.model.js";

// Relaciones entre modelos

// User ↔ Universidad
UniversidadModel.belongsTo(UserModel, { foreignKey: "userId" });
UserModel.hasOne(UniversidadModel, { foreignKey: "userId" });

// Universidad ↔ Carrera
CarreraModel.belongsTo(UniversidadModel, { foreignKey: "universityId" });
UniversidadModel.hasMany(CarreraModel, { foreignKey: "universityId" });

// Carrera ↔ Inscripción
InscripcionModel.belongsTo(CarreraModel, { foreignKey: "careerId" });
CarreraModel.hasOne(InscripcionModel, { foreignKey: "careerId" });

// Exportar todos los modelos
export {
  sequelize,
  UserModel,
  UniversidadModel,
  CarreraModel,
  InscripcionModel,
};
