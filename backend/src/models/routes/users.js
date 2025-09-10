import express from "express";
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { where } from "sequelize";

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.findAll({ attributes: {exclude: [password]}});
    res.json(users);
});

router.post('/', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
   
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
   
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return res.status(401).json({ message: 'Contraseña incorrecta'});
    
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en login' });
    }
});

export default router;