import {
  validateEmail,
  validateString,
  validatePassword,
} from "../helper/validations.js";

import { User } from "../models/User.js";
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