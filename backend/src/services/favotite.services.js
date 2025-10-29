import { Favorite } from "../models/Favorite.js";
import { Property } from "../models/Property.js";

export const getFavoritesByUser = async (userId) => {
    return await Favorite.findAll({
        where: { user_id: userId },
        include: [Property],
    });
};

export const addFavorite = async (userId, propertyId) => {
    const existing = await Favorite.findOne({
        where: { user_id: userId, property_id: propertyId },
    });

if (existing) throw new Error("Ya es un favorito");

await Favorite.create({
    user_id: userId,
    property_id: propertyId,
});

return { message: "Propiedad añadida a favoritos" };
};

export const removeFavorite = async (userId, propertyId) => {
    await Favorite.destroy({
        where: { user_id: userId, property_id: propertyId }, 
    });

    return { message: "Propiedad eliminada de favoritos" };
}
