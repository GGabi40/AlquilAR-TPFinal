import { Router } from "express";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  forgotPassword,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  resetPassword,
  updateUser,
  deleteUser,
  verifyEmail
} from "../services/auth.services.js";

import { blockUser, updateUserRole } from "../services/superadmin.services.js";

const router = Router();

// SuperAdmin Routes
router.get("/all-users", verifyToken, roleMiddleware("superadmin"), getAllUsers);
router.patch("/:id/block", verifyToken, roleMiddleware("superadmin"), blockUser);
router.patch("/:id/updateRole", verifyToken, roleMiddleware("superadmin"), updateUserRole);

/* User Routes */
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id/delete", verifyToken, deleteUser);

router.get("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
