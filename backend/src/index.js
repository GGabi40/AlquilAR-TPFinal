import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { port, sequelize } from './config/db.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

try {
    await sequelize.sync();
    app.listen(port, () => {
        console.log(`Corriendo servidor en http://localhost:${port}`);
    });
} catch(e) {
    console.error('Error al inicializar servidor: ', error);
}