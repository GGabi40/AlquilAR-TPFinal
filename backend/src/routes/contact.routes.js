import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { sendEmail } from "../services/contact.service.js";

const router = express.Router();

router.post("/:id", verifyToken, sendEmail);

export default router;