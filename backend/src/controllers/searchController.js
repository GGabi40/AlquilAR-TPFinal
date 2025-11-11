import { Property } from "../models/Property.js";
import { Op } from "sequelize";

export const searchProperties = async (req, res) => {
    try {
        const { ciudad, tipo, ambientes, precioMax } = req.query;

        const where = {};

        if (ciudad) {
            where.city = { [Op.like]: `%${ciudad}%` };
        }
        if (tipo) {
            where.type = { [Op.like]: `%${tipo}%` };
        }
        if (ambientes) {
            if (ambientes === "3+") {
                where.rooms = { [Op.gte]: 3 };
            } else {
                where.rooms = ambientes;
            }
        }
        if (precioMax) {
            where.price = { [Op.lte]: precioMax };
        }

        const properties = await Property.findAll({ where });

        res.json(properties);
    } catch (error) {
        console.error("Error al buscar propiedades:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
