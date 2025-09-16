import express from "express";
import { Property } from "../models/Property.js";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/owner/:id",
    verifyToken,
    roleMiddleware(["owner", "superadmin"]),
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

router.get("/", authenticate, authorizeRoles("superadmin", async (req, res) => {
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
}));

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

router.patch("/:id/featured", authenticate, authorizeRoles("owner", "superadmin"),
    async (req, res) => {
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

export default router;