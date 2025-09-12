import express from "express";
import { Property } from "../models/Property.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/owner/:id",
    authenticate,
    authorizeRoles("owner", "superadmin"),
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

export default router;