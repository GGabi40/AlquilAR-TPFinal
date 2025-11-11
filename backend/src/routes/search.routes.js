import express from "express";
import { searchProperties } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchProperties);

export default router;