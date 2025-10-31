import express from "express";
import { Property } from "../models/Property.js";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import {
    createNewProperty,
    getPropertiesByOwner,
    getPropertyById,
    getAllProperties,
    getFeaturedProperties,
    updateProperty,
    updateFeaturedProperty,
    deleteProperty,
    getRecentProperties,
    getSearchProperties
} from "../services/properties.services.js";

const router = express.Router();

/* Owners and Superadmin */
router.post("/", verifyToken, roleMiddleware(["owner", "superadmin"]), createNewProperty);
router.put("/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), updateProperty);
router.delete("/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), deleteProperty);
router.get("/owner/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), getPropertiesByOwner);
router.patch("/:id/featured", verifyToken, roleMiddleware(["owner", "superadmin"]), updateFeaturedProperty);

/* Users */
router.get("/", getAllProperties);
router.get("/featured", getFeaturedProperties);
router.get("/:id", getPropertyById);
router.get("/recent", getRecentProperties);

router.get("/search", getSearchProperties);

export default router;