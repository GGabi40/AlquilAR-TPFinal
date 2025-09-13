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

router.post("/login", loginUser);
router.post("/register", registerUser);


export default router;
