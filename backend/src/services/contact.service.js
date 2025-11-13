import { validateEmail, validateString } from "../helper/validations.js";
import { User } from "../models/User.js";
import { Property } from "../models/Property.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const sendEmail = async (req, res) => {
  try {
    const error = validateContactData(req.body);
    if (error) return res.status(400).json({ message: error });
    
    const ownerId = req.params.id;
    const owner = await User.findByPk(ownerId);
    
    if (!owner) throw new Error("Propietario no encontrado");
    
    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: `"AlquilAR - Nuevo contacto" <${process.env.EMAIL_USER}>`,
      to: owner.email,
      subject: `Nuevo mensaje de ${name}`,
      html: `
        <h2>Nuevo interesado en tu propiedad</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <hr>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Correo enviado correctamente al propietario." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({ message: "Error al enviar el correo." });
  }
};

/* Validations */
const validateContactData = ({ name, email, phone, message }) => {
  if (!name || !validateString(name, 2, 50)) return "Nombre inválido";
  if (!email || !validateEmail(email)) return "Email inválido";
  if (!phone || !validateString(phone, 6, 20)) return "Teléfono inválido";
  if (!message || !validateString(message, 5, 1000)) return "Mensaje inválido";
  return null;
};