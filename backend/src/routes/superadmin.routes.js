import express from "express";
import { blockUser, updateUserRole } from "../services/superadmin.services.js";
import { User } from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/users/all-users", async (req, res) => {
    try {
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Acceso denegado. Solo para superadmins." });
        }

        const users = await User.findAll({
            attributes: ["id", "name", "surname", "email", "isBlocked", "role"],
        });

        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error del servidor." });
    }
});

router.patch("/users/block/:id", blockUser);

router.put("/users/update-role/:id", updateUserRole);

export default router;