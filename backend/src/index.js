import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import './models/associations.js';

import userRoutes from './routes/auth.routes.js';
import propertiesRoutes from './routes/properties.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import ratingsRoutes from './routes/ratings.routes.js';
import postsRoutes from './routes/posts.routes.js';
import rentalsRoutes from './routes/rental.routes.js';
import { port, sequelize } from './config/db.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/rentals", rentalsRoutes);

try {
    await sequelize.sync({ alter: true });
    app.listen(port, () => {
        console.log(`Corriendo servidor en http://localhost:${port}`);
    });
} catch(e) {
    console.error('Error al inicializar servidor: ', e);
}