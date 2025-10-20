import express from "express";
import { Property } from "../models/Property.js";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import {
    createNewProperty,
    getPropertiesByOwner,
    getPropertyById,
    getAllProperties,
    getFeaturedProperties,
    updateProperty,
    updateFeaturedProperty,
    deleteProperty
} from "../services/properties.services.js";

const router = express.Router();

/* Owners and Superadmin */
router.post("/", verifyToken, roleMiddleware(["owner", "superadmin"]), createNewProperty);
router.put("/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), updateProperty);
router.delete("/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), deleteProperty);
router.get("/owner/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), getPropertiesByOwner);
router.patch("/:id/featured", verifyToken, roleMiddleware(["owner", "superadmin"]), updateFeaturedProperty);

/* Users */
router.get("/", getAllProperties);
router.get("/featured", getFeaturedProperties);
router.get("/:id", getPropertyById);
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