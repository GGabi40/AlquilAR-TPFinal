import { Router } from "express";
import { verifyToken, roleMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/* 
Ruta que cambia rol de "user" a "owner" 

-- luego de ruta + servicio -> properties.service.js
*/
