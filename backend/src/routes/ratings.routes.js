import express from "express";
import Rating from "../models/Rating.js";
import { verifyToken as authenticate } from "../middleware/authMiddleware.js";
import { sequelize } from "../config/db.js";

const router = express.Router();

router.post("/:propertyId", authenticate, async (req, res) => {
    try {
        const { stars } = req.body;

        const [rating, created] = await Rating.upsert({
            user_id: req.user.id,
            property_id: req.params.propertyId,
            stars
        }, { returning: true });

        res.json({
            message: created ? "Rating creado" : "Rating actualizado",
            rating
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get(":propertyId", async (req, res) => {
    try {
        const ratings = await Rating.findAll({
            where: { propertyId: req.params.propertyId }
        });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:propertyId/average", async (req, res) => {
    try {
        const avg = await Rating.findOne({
            attributes: [[sequelize.fn("AVG", sequelize.col("estrellas")), "promedio"]],
            where: { property_id: req.params.propertyId },
            raw: true
        });

        res.json({ promedio: parseFloat(avg.promedio).toFixed(2) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
});

export default router;