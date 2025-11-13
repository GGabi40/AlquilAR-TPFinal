import { Router } from "express";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";

import { 
    getRentalById,
    getRentalsByTenant,
    getRentalsByOwner,
    createRental,
    updateRentalStatus,
    finishRental,
    getActiveRentals
} from "../services/rental.services.js";

const router = Router();

router.get("/status/active", verifyToken, getActiveRentals);

/* Superadmin */
router.get("/:id", verifyToken, roleMiddleware(["superadmin"]), getRentalById);

/* Owner */
router.post("/", verifyToken, createRental);
router.get("/owner/my-rentals", verifyToken, getRentalsByOwner);
router.put("/:id/status", verifyToken, updateRentalStatus);
router.put("/:id/finish", verifyToken, finishRental);

/* User */
router.get("/tenant/my-rentals", verifyToken, getRentalsByTenant);

export default router