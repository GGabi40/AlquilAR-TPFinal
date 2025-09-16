import {
  validateEmail,
  validateString,
  validatePassword,
} from "../helper/validations.js";

import { User } from "../models/User.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req,res) => {
    try {
        const allUsers = await User.findAll({ attributes: { exclude: ['password'] } });

        if (!allUsers) return res.status(404).json({ message: 'No hay usuarios disponibles.'});

        res.json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const getUserById = async (req,res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        
        if(user.id !== Number(id)) return res.status(400).json({ message: 'No tienes permiso para ver este usuario.' });

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del usuario.' });
    }
};

export const registerUser = async (req,res) => {
    const result = validateRegisterData(req.body);

    if(result.error) return res.status(400).json({ message: result.message });

    const { name, surname, email, password, isActive, role } = req.body;

    try {
        const existingEmail = await User.findOne({ where: { email } });
        
        if (existingEmail) return res.status(400).json({ message: 'Este email ya está registrado.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            name,
            surname, 
            email, 
            password: hashedPassword,
            isActive, 
            role: role || "user",
        })

        res.status(201).json({ message: 'Usuario registrado correctamente.', user: newUser.id });
    } catch (error) {
        console.error('Error al crear usuario: ', error);
        res.status(500).json({ message: 'Error al crear usuario.' });
    }
};

export const loginUser = async (req,res) => {
    const result = validateLoginData(req.body);

    if(result.error) return res.status(500).json({ message: result.message });

    
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if(!user) return res.status(401).json({ message: 'Este email no esta registrado.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Email o contraseña incorrectos.' });

        // create token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesion: ', error);
        res.status(500).json({ message: 'Error al iniciar sesion.' });
    }
};


// --- Validations ---
const validateRegisterData = (reqData) => {
    const result = { error: false, message: '' };

    const { name, surname, email, password } = reqData;

    if(!name || !validateString(name, null, 25)) {
        return {
            error: true,
            message: 'Nombre de usuario inválido.'
        };
    }

    if(!surname || !validateString(surname, null, 70)) {
        return {
            error: true,
            message: 'Apellido inválido.'
        };
    }

    if(!email || !validateEmail(email)) {
        return {
            error:true,
            message: 'Email invalido.'
        }
    } else if (!password || !validatePassword(password, 6, null, false, false)) {
        return {
            error: true,
            message: "Contraseña Inválida"
        }
    }

    return result;
}

const validateLoginData = (reqData) => {
    const result = { error: false, message: '' };

    const { email, password } = reqData;

    if(!email || !validateEmail(email)) {
        return {
            error: true,
            message: 'Email inválido.'
        }
    } else if (!password || !validatePassword(password, 6, null, false, false)) {
        return {
            error:true,
            message: 'Contraseña inválida'
        }
    }

    return result;
}