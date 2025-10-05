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
  deactivateUser
} from "../services/auth.services.js";

const router = Router();

// SuperAdmin Routes
router.get("/all-users", verifyToken, roleMiddleware("superadmin"), getAllUsers);

/* User Routes */
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.patch('/:id/deactivate', verifyToken, deactivateUser);
// router.delete("/:id", verifyToken, getUserById);

router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);
router.post("/register", registerUser);


export default router;
