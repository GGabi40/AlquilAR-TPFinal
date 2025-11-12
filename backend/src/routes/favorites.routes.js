import express from "express";
import { verifyToken as authenticate } from "../middleware/authMiddleware.js";
import { getFavoritesByUser, addFavorite, removeFavorite } from "../services/favorite.services.js";
const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const favorites = await getFavoritesByUser(req.user.id);
        res.status(200).json({ success: true, favorites });
    } catch (err) {
        toastError("Error al obtener favoritos:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/:propertyId", authenticate, async (req, res) => {
    try {
        const result = await addFavorite(req.user.id, req.params.propertyId);
        res.status(201).json({ success: true, message: "Agregado a favoritos", result });
    } catch (err) {
        console.error("Error al agregar favorito:", err);
        res.status(400).json({ success: false, message: err.message });
    }
});

router.delete("/:propertyId", authenticate, async (req, res) => {
    try {
        const result = await removeFavorite(req.user.id, req.params.propertyId);
        res.status(200).json({ success: true, message: "Eliminado de favoritos", result });
    } catch (err) {
        console.error("Error al eliminar favorito:", err);
        res.status(500).json({success: false, message: err.message });
    }
});

export default router;