import { UniversidadModel } from "../models/universidades.model.js";

export const crearUniversidad = async (req, res) => {
  try {
    const { name, address, phone, website } = req.body;

    const universidadExistente = await UniversidadModel.findOne({
      where: { userId: req.usuario.id },
    });

    if (universidadExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe una universidad para este usuario." });
    }

    const nuevaUniversidad = await UniversidadModel.create({
      name,
      address,
      phone,
      website,
      userId: req.usuario.id,
    });

    res
      .status(201)
      .json({
        mensaje: "Universidad creada correctamente.",
        universidad: nuevaUniversidad,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear universidad." });
  }
};
