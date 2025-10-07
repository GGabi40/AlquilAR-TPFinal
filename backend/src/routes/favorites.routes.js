import express from "express";
import Favorite from "../models/Favorite.js";
import { Property } from "../models/Property.js";
import { verifyToken as authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { user_id: req.user.id },
            include: [Property]
        });
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/:propertyId", authenticate, async (req, res) => {
    try {
        const existing = await Favorite.findOne({
            where: {
                userId: req.user.id,
                propertyId: req.params.propertyId
            }
        });

        if (existing) return res.status(400).json({ message: "Ya es un favorito" });

        await Favorite.create({
            user_id: req.user.id,
            property_id: req.params.propertyId
        });
        res.json({ message: "Propiedad añadida a favoritos" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:propertyId", authenticate, async (req, res) => {
    try {
        await Favorite.destroy({
            where: {
                user_Id: req.user.id,
                property_id: req.params.propertyId
            }
        });
        res.json({ message: "Propiedad eliminada de favoritos" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;