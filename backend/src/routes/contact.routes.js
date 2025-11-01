import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
    const { nombre, email, telefono, mensaje, propertyId } = req.body;

    console.log("Nuevo mensaje de contacto: ", { nombre, email, telefono, mensaje });

    if ( !nombre || !email || !telefono || !mensaje || !propertyId ) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    try {

        const property = await Property.findByPk(propertyId, {
            include: { model: User, as: "owner" }
        });

        if (!property) return res.status(404).json({ success: false, message: "Propiedad no encontrada" });

        const emailPropietario = property.owner.email;
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"AlquilAR - Nuevo contacto" <${process.env.EMAIL_USER}>`,
            to: emailPropietario,
            subject: `Nuevo mensaje de ${nombre}`,
            html: `
                <h2>Nuevo interesado en tu propiedad</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Mensaje:</strong> ${mensaje}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Correo enviado correctamente al propietario." });

    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ success: false, message: "Error al enviar el correo." });
    }
});

export default router;