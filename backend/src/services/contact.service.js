import { validateEmail, validateString } from "../helper/validations.js";
import { User } from "../models/User.js";
import { Property } from "../models/Property.js";
import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();
export const sendEmail = async (req,res) => {
    const { name, email, cellphone, message } = req.body;
    const { id } = req.params; // id de propiedad

    const validations = validateContactData(req.body);

    if(validations.error) return res.status(400).json({ message: validations.message });

    try {
        const property = await Property.findByPk(id, {
            include: [{ model: User, as: "owner" }]
        });

        if (!property) return res.status(404).json({ message: "Propiedad no encontrada" });

        const owner = property.owner;
        if(!owner) return res.status(404).json({ message: "El propietario no existe." });

        const existingUser = await User.findOne({ where: email });
        if (!existingUser) return res.status(403).json({ message: "El usuario no está registrado. Solo usuarios verificados pueden contactar propietarios." });


        if (!existingUser.cellphone && cellphone) {
            existingUser.cellphone = cellphone;
            await existingUser.save();
        }

        const ownerEmail = owner.email;
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"AlquilAR - Nuevo contacto" <${process.env.EMAIL_USER}>`,
            to: ownerEmail,
            subject: `Nuevo mensaje de ${name}`,
            html: `
                <h2>Nuevo interesado en tu propiedad</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${cellphone}</p>
                <hr>
                <p><strong>Mensaje:</strong> \n${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Correo enviado correctamente al propietario." });

    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ message: "Error al enviar el correo." });
    }
};

/* Validations */
const validateContactData = (data) => {
    const result = { error: false, message: "" };

    const { name, email, cellphone, message } = data;

    if(!name || !validateString(name, 2, 50)) {
        return { error: true, message: "Nombre inválido o demasiado corto." };
    }

     if (!email || !validateEmail(email)) {
        return { error: true, message: "Correo electrónico inválido." };
    }

    if (!cellphone || !validateString(cellphone, 6, 20)) {
      return { error: true, message: "Número de teléfono inválido." };
    }

    if (!message || !validateString(message, 5, 1000)) {
      return { error: true, message: "Mensaje demasiado corto o inválido." };
    }

    return result;
}