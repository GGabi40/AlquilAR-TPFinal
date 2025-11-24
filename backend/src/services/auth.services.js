import {
  validateEmail,
  validateString,
  validatePassword,
} from "../helper/validations.js";

import { User } from "../models/User.js";

import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (!allUsers)
      return res.status(404).json({ message: "No hay usuarios disponibles." });

    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (user.id !== Number(id))
      return res
        .status(400)
        .json({ message: "No tienes permiso para ver este usuario." });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos del usuario." });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { name, surname, avatarColor } = req.body;

    const user = await User.findByPk(id);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    if (req.body.email && req.body.email !== user.email) {
      return res.status(400).json({
        message: "El correo electrónico no puede modificarse desde el perfil.",
      });
    }

    user.name = name ?? user.name;
    user.surname = surname ?? user.surname;
    user.avatarColor = avatarColor ?? user.avatarColor;

    await user.save();

    res.status(200).json({ message: "Perfil actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar usuario: ", error);
    res.status(500).json({ message: "Error al actualizar usuario." });
  }
};

export const registerUser = async (req, res) => {
  const result = validateRegisterData(req.body);

  if (result.error) return res.status(400).json({ message: result.message });

  const {
    name,
    surname,
    email,
    password,
    isBlocked,
    avatarColor,
    role,
  } = req.body;

  try {
    const existingEmail = await User.findOne({ where: { email } });

    if (existingEmail)
      return res
        .status(400)
        .json({ message: "Este email ya está registrado." });

    const hashedPassword = await bcrypt.hash(password, 10);

    // token de verificación
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = Date.now() + 60 * 60 * 1000;

    const newUser = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      isBlocked,
      avatarColor: avatarColor || "#ffc107",
      role: role || "user",
      verified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"AlquilAR" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verificá tu cuenta en AlquilAR",
      html: `
        <div style="font-family: Arial, sans-serif; text-align:center;">
          <h2>¡Bienvenido a <strong>AlquilAR</strong>!</h2>
          <p>Para activar tu cuenta, hacé click en el siguiente botón:</p>
          <a href="${verificationLink}" style="background:#2596be; color:white; padding:10px 20px; border-radius:5px; text-decoration:none;">Verificar mi cuenta</a>
          <p style="margin-top:20px;">Este enlace expirará en 1 hora.</p>
        </div>
      `,
    });

    res
      .status(201)
      .json({ message: "Usuario registrado correctamente.", user: newUser.id });
  } catch (error) {
    console.error("Error al crear usuario: ", error);
    res.status(500).json({ message: "Error al crear usuario." });
  }
};

export const loginUser = async (req, res) => {
  const result = validateLoginData(req.body);

  if (result.error) return res.status(500).json({ message: result.message });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(401)
        .json({ message: "Este email no esta registrado." });

    if (!user.verified) {
      return res.status(403).json({
        message: "Debes verificar tu correo antes de iniciar sesión.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos." });

    if (user.isBlocked)
      return res
        .status(403)
        .json({ message: "Tu cuenta fue bloqueada. Contactá con soporte." });

    // create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("Error al iniciar sesion: ", error);
    res.status(500).json({ message: "Error al iniciar sesion." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ where: { resetToken: token } });

    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Se restableció la contraseña con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al resetear contraseña." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // random token
    const randomToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1800000;

    user.resetToken = randomToken;
    user.resetTokenExpiry = expiry;
    await user.save();

    // nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${randomToken}`;

    await transporter.sendMail({
      from: `"AlquilAR" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperación de contraseña",
      html: `<div style="text-align: center;">
      <h1 style="color:#fff; font-style:italic;">AlquilAR</h1>
      <h2>Recuperación de Contraseña</h2>
      <p>Haz click en el siguiente enlace para resetear tu contraseña:</p>
      <a href="${resetLink}" style="color:#fff; background:#007bff; padding:10px 20px; text-decoration:none; border-radius:5px;">Resetear Contraseña</a>
      <br><br>
      <p><strong>⚠️ Este enlace expirará en 30 minutos.</strong></p>
      <p style="color: red;"><strong>No compartas este enlace con nadie. Nadie de AlquilAR te lo pedirá por correo ni por ningún otro medio.</strong></p>
    </div>`,
    });

    res.json({ message: "Email enviado con instrucciones." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el proceso de recuperación" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    const isOwner = parseInt(id) === user.id;
    const isSuperadmin = req.user.role === "superadmin";

    if (!isOwner && !isSuperadmin) {
      return res
        .status(403)
        .json({ message: "No tenés autorización para eliminar este usuario." });
    }

    if (isSuperadmin && isOwner) {
      return res.status(403).json({
        message: "No podés eliminar tu propia cuenta de superadministrador.",
      });
    }

    await user.destroy({ where: { id } });

    res.json({ message: "Cuenta eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token);

    if (!token) return res.status(400).json({ message: "Token faltante." });

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user)
      return res
        .status(400)
        .json({ message: "Token inválido o usuario no encontrado." });

    if (user.verificationTokenExpiry < Date.now()) {
      user.destroy();

      return res
        .status(400)
        .json({ message: "El token expiró. Registrate nuevamente." });
    }

    user.verified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.json({ message: "Cuenta verificada exitosamente." });
  } catch (error) {
    console.error("Error al verificar email:", error);
    res
      .status(500)
      .json({ message: "Error al verificar el correo electrónico." });
  }
};

export const searchUser = async (req, res) => {
  const { query } = req.query;

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${query}%` } },
        { surname: { [Op.like]: `%${query}%` } },
        { email: { [Op.like]: `%${query}%` } },
      ],
    },
    limit: 10,
    attributes: ["id", "name", "surname", "email"],
  });

  res.json(users);
};

// --- Validations ---
const validateRegisterData = (reqData) => {
  const result = { error: false, message: "" };

  const { name, surname, email, password } = reqData;

  if (!name || !validateString(name, null, 25)) {
    return {
      error: true,
      message: "Nombre de usuario inválido.",
    };
  }

  if (!surname || !validateString(surname, null, 70)) {
    return {
      error: true,
      message: "Apellido inválido.",
    };
  }

  if (!email || !validateEmail(email)) {
    return {
      error: true,
      message: "Email invalido.",
    };
  } else if (!password || !validatePassword(password, 6, null, false, false)) {
    return {
      error: true,
      message: "Contraseña Inválida",
    };
  }

  return result;
};

const validateLoginData = (reqData) => {
  const result = { error: false, message: "" };

  const { email, password } = reqData;

  if (!email || !validateEmail(email)) {
    return {
      error: true,
      message: "Email inválido.",
    };
  } else if (!password || !validatePassword(password, 6, null, false, false)) {
    return {
      error: true,
      message: "Contraseña inválida",
    };
  }

  return result;
};
