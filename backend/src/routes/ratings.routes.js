import express from "express";
import { verifyToken as authenticate } from "../middleware/authMiddleware.js";
import { addOrUpdateRating, getRatingByProperty, getAverageRating } from "../services/rating.services.js";

const router = express.Router();

router.post("/:propertyId", authenticate, async (req, res) => {
    try {
        const { stars, content } = req.body;
        const result = await addOrUpdateRating(
            req.user.id,
            req.params.propertyId,
            stars,
            content
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:propertyId", async (req, res) => {
    try {
        const ratings = await getRatingByProperty(req.params.propertyId);
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:propertyId/average", async (req, res) => {
    try {
        const avg = await getAverageRating(req.params.propertyId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
});

export default router;