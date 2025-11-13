import { Router } from "express";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllPosts,
  getPostById,
  getPostsByOwner,
  updatePost,
  updatePostStatus,
  deletePost,
} from "../services/posts.services.js";

const router = Router();

/* Public routes */
router.get("/", getAllPosts);

router.get("/owner/:ownerId", verifyToken, getPostsByOwner);

router.get("/:id", getPostById);

router.put("/:id", verifyToken, roleMiddleware(["owner"]), updatePost);

router.patch(
  "/:id/status",
  verifyToken,
  roleMiddleware(["owner", "superadmin"]),
  updatePostStatus
);

router.delete(
  "/:id",
  verifyToken,
  roleMiddleware(["owner", "superadmin"]),
  deletePost
);

export default router;
