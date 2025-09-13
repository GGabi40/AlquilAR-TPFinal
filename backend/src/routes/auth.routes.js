import { Router } from "express";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
} from "../services/auth.services.js";

const router = Router();

// SuperAdmin Routes
router.get("/", verifyToken, roleMiddleware("superadmin"), getAllUsers);

/* User Routes */
router.get("/:id", verifyToken, getUserById);

router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;
