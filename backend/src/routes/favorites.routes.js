import express from "express";
import { verifyToken as authenticate } from "../middleware/authMiddleware.js";
import { getFavoritesByUser, addFavorite, removeFavorite } from "../services/favotite.services.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const favorites = await getFavoritesByUser(req.user.id)
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/:propertyId", authenticate, async (req, res) => {
    try {
        const result = await addFavorite(req.user.id, req.params.propertyId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:propertyId", authenticate, async (req, res) => {
    try {
        const result = await removeFavorite(req.user.id, req.params.propertyId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;