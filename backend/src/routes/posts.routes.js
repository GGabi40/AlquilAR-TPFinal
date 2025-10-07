import { Router } from "express";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";

import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByOwner,
  updatePost,
  updatePostStatus,
  deletePost
} from "../services/posts.services.js";

const router = Router();

/* Users */
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// TODO: Rutas para marcar favoritos y rating


/* Owners and Superadmin */
router.post("/", verifyToken, roleMiddleware(["owner", "superadmin"]), createPost);
router.put("/:id", verifyToken, roleMiddleware(["owner"]), updatePost);
router.patch("/:id/status", verifyToken, roleMiddleware(["owner", "superadmin"]), updatePostStatus);
router.get("/owner/:ownerId", verifyToken, getPostsByOwner);

router.delete("/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), deletePost);


export default router;