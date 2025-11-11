import express from "express";
import {
    getAllProperties,
    getPropertyById,
    getPropertiesByOwner,
    updateProperty,
    updateFeaturedProperty,
    deleteProperty,
    getSearchProperties,
    requestNewProperty
} from "../services/properties.services.js";

import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";
import { approveProperty, rejectProperty } from "../services/superadmin.services.js";

const router = express.Router();

/* Owners and Superadmin */
router.put("/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), updateProperty);
router.delete("/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), deleteProperty);
router.get("/owner/:id", verifyToken, roleMiddleware(["owner", "superadmin"]), getPropertiesByOwner);
router.patch("/:id/featured", verifyToken, roleMiddleware(["owner", "superadmin"]), updateFeaturedProperty);

/* Superadmin */
router.patch("/:id/approve", verifyToken, roleMiddleware(["superadmin"]), approveProperty);
router.patch("/:id/reject", verifyToken, roleMiddleware(["superadmin"]), rejectProperty)


/* Users */
router.post("/request", verifyToken, roleMiddleware(["user", "owner"]), requestNewProperty);

/*public*/
router.get("/", getAllProperties);
router.get("/search", getSearchProperties);
router.get("/:id", getPropertyById);

// router.get("/featured", getFeaturedProperties);

export default router;