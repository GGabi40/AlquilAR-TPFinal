import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

export const getAllProperties = async () => {
  try {
    return await Property.findAll({
      include: [{ model: User, attributes: ["id", "correo"] }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.error("Error al obtener todas las propiedades:", error);
    throw new Error("Error al obtener propiedades");
  }
};

// Traer propiedades de un dueño
export const getPropertiesByOwner = async (ownerId) => {
  try {
    return await Property.findAll({ where: { ownerId } });
  } catch (error) {
    console.error("Error al obtener propiedades del owner:", error);
    throw new Error("Error al obtener propiedades");
  }
};

// Traer propiedades destacadas
export const getFeaturedProperties = async () => {
  try {
    return await Property.findAll({
      where: { featured: true },
      order: [["createdAt", "DESC"]],
      limit: 9,
    });
  } catch (error) {
    console.error("Error al obtener propiedades destacadas:", error);
    throw new Error("Error al obtener propiedades destacadas");
  }
};

// Actualizar propiedad destacada
export const updateFeaturedProperty = async (id, featured) => {
  try {
    const property = await Property.findByPk(id);
    if (!property) throw new Error("Propiedad no encontrada");

    property.featured = featured;
    await property.save();
    return property;
  } catch (error) {
    console.error("Error al actualizar propiedad destacada:", error);
    throw new Error("Error al actualizar propiedad destacada");
  }
};