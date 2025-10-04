import express from "express";
import { Property } from "../models/Property.js";
import { verifyToken as authenticate, roleMiddleware as authorizeRoles } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import * as propertyService from "../services/properties.services.js";

const router = express.Router();

router.get(
    "/owner/:id",
    authenticate,
    authorizeRoles(["owner", "superadmin"]),
    async (req, res) => {
        try {
            const { id } = req.params;

            const properties = await Property.findAll({
                where: { ownerId: id },
            });

            res.json(properties);
        } catch (error) {
            console.error("Error al obtener propiedades:", error);
            res.status(500).json({ message: "Error al obtener propiedades" });
        }
    }
);

router.get("/", authenticate, authorizeRoles(["superadmin"]), async (req, res) => {
    try {
        const properties = await Property.findAll({
            include: [{ model: User, attributes: ["id", "correo"] }],
            order: [["createdAt", "DESC"]],
        });

        res.json(properties);
    } catch (error) {
        console.error("Error al obtener todas las propiedades:", error);
        res.status(500).json({ message: "Error al obtener propiedades" });
    }
});

router.get("/featured", async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { featured: true },
            order: [["createdAt", "DESC"]],
            limit: 9,
        });

        res.json(properties);
    } catch (error) {
        console.error("Error al actualizar propiedad destacada: ", error);
        res.status(500).json({ message: "Error al actualizar propiedad destacada" });
    }
});

router.get("/recent", async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [["createdAt", "DESC"]],
            limit: 9,
        });

        res.json(properties);
    } catch (error) {
        console.error("Error al obtener propiedades recientes: ", error);
        res.status(500).json({ message: "Error al obtener propiedades recientes" });
    }
});

router.patch("/:id/featured", authenticate, authorizeRoles(["owner", "superadmin"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { featured } = req.body;

        const property = await Property.findByPk(id);

        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }

        property.featured = featured;
        await property.save();

        res.json({
            message: `Propiedad ${featured ? "marcada" : "desmarcada"} como destacada`,
            property,
        });
    } catch (error) {
        console.error("Error al actualizar propiedad destacada:", error);
        res.status(500).json({ message: "Error al actualizar propiedad destacada" });
    }
});


// router.post("/", authenticate, authorizeRoles(["owner", "superadmin"]), createProperty);

// router.put("/:id", authenticate, authorizeRoles(["owner", "superadmin"]), updateProperty);

// router.delete("/:id", authenticate, authorizeRoles(["owner", "superadmin"]), deleteProperty);

import { Op } from "sequelize";

router.get("/search", async (req, res) => {
    try {
        const {
            address,
            minPrice,
            maxPrice,
            keyword,
            propertyType,
            rentPreference,
            status,
            page = 1,
            limit = 10
        } = req.query;

        const where = {};
        
        if (address) {
            where.address = { [Op.like]: `%${address}%` };
        }

        if (minPrice && maxPrice) {
            where.rentPrice = { [Op.between]: [minPrice, maxPrice] };
        }

        if (propertyType) {
            where.propertyType = propertyType;
        }

        if (rentPreference) {
            where.rentPreference = rentPreference;
        }

        if (status) {
            where.status = status;
        }

        if (keyword) {
            where[Op.or] = [
                { address: { [Op.like]: `%${keyword}%` } },
                { propertyType: { [Op.like]: `%${keyword}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Property.findAndCountAll({
            where,
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [["createdAt", "DESC"]]
        });

        res.json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            properties: rows
        });
    } catch (error) {
        console.error("Error en búsqueda:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;