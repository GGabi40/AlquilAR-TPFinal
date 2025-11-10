import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

import './models/associations.js';

import userRoutes from './routes/auth.routes.js';
import propertiesRoutes from './routes/properties.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import ratingsRoutes from './routes/ratings.routes.js';
import postsRoutes from './routes/posts.routes.js';
import rentalsRoutes from './routes/rental.routes.js';
import contactRoutes from './routes/contact.routes.js';
import locationRoutes from './routes/locations.routes.js';
// import uploadRoutes from './routes/upload.routes.js';
import { sequelize } from './config/db.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));


app.use(express.json());
app.use('/api/users', userRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/location', locationRoutes);
// app.use('/api/upload', uploadRoutes);

try {
    await sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Corriendo el servidor.`);
    });
} catch(e) {
    console.error('Error al inicializar servidor: ', e);
}