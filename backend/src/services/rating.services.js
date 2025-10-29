import { Rating } from "../models/Rating";
import { sequelize } from "../config/db";

export const addOrUpdateRating = async (userId, propertyId, stars, content) => {
    const [rating, created] = await Rating.upsert(
        { userId, propertyId, stars, content },
        { returning: true }
    );
    
    return {
        message: created? "Rating creado" : "Rating actualizado",
        rating,
    };
};

export const getRatingByProperty = async (propertyId) => {
    return await Rating.findAll({
        where: { propertyId },
        order: [["id", "DESC"]],
    });
};

export const getAverageRating = async (propertyId) => {
    const avg = await Rating.findOne({
        attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "promedio"]],
        where: { property_id: propertyId },
        raw: true,
    });

    return { promedio: parseFloat(avg.promedio || 0).toFixed(2) };
}