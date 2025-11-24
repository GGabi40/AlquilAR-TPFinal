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
  verifyEmail,
  searchUser,
  resendVerificationEmail
} from "../services/auth.services.js";

import { blockUser, updateUserRole } from "../services/superadmin.services.js";

const router = Router();

// SuperAdmin Routes
router.get("/all-users", verifyToken, roleMiddleware("superadmin"), getAllUsers);
router.patch("/:id/block", verifyToken, roleMiddleware("superadmin"), blockUser);
router.patch("/:id/updateRole", verifyToken, roleMiddleware("superadmin"), updateUserRole);
router.get("/search", verifyToken, roleMiddleware(['superadmin', 'owner']), searchUser);

/* User Routes */
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id/delete", verifyToken, deleteUser);

router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
