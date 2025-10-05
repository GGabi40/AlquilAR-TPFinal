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
  deactivateUser,
  deleteUser
} from "../services/auth.services.js";

const router = Router();

// SuperAdmin Routes
router.get("/all-users", verifyToken, roleMiddleware("superadmin"), getAllUsers);
// router.patch('/:id/deactivate', verifyToken, roleMiddleware("superadmin"), deactivateUser);

/* User Routes */
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id/delete", verifyToken, deleteUser);

router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);
router.post("/register", registerUser);


export default router;
