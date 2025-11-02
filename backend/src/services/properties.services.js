import { Property } from "../models/Property.js";
import { User } from "../models/User.js";
import { Op } from "sequelize";


export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [{ model: User, attributes: ["id", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    if (!properties || properties.length === 0)
      return res.status(404).json({ message: "No hay propiedades disponibles." })
    res.json(properties);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener propiedades" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyById = await Property.findByPk(id);

    if (!propertyById)
      return res.status(404).json({ message: "No se encontro ninguna propiedad" });
    res.json(propertyById);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la propiedad" })
  }
}

//POST
export const createNewProperty = async (req, res) => {
  try {
    const result = validatePropertyData(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.message });
    }

    const { propertyType, rentPrice, expensesPrice, status, rentPreference, address, numRooms, numBedrooms, numBathrooms, propertyAge, totalArea, URLImages, URLVideo, URLDocument, nameP, nameL } = req.body;
    const newProperty = await Property.create({
      propertyType, 
      rentPrice, 
      expensesPrice, 
      status, 
      rentPreference, 
      address, 
      numRooms, 
      numBedrooms, 
      numBathrooms, 
      propertyAge, 
      totalArea, 
      URLImages, 
      URLVideo, 
      URLDocument, 
      nameP, 
      nameL,
    });

    res.json(newProperty);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "No se pudo crear la propiedad"});
  }

}

//PUT-UPDATE
export const updateProperty = async (req, res) => {
  const result = validatePropertyData(req.body);

  if (result.error) {
    return res.status(400).json({ message: result.message });
  }
  
  const { propertyType, rentPrice, expensesPrice, status, rentPreference, address, numRooms, numBedrooms, numBathrooms, propertyAge, totalArea, URLImages, URLVideo, URLDocument, nameP, nameL } = req.body;

  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
    return res.status(404).send({ message: "No se encontro una propiedad!" });
  }
  try {
    await property.update({
      propertyType, 
      rentPrice, 
      expensesPrice, 
      status, 
      rentPreference, 
      address, 
      numRooms, 
      numBedrooms, 
      numBathrooms, 
      propertyAge, 
      totalArea, 
      URLImages, 
      URLVideo, 
      URLDocument, 
      nameP, 
      nameL,
    });
    res.json(property);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).send({ message: "Algo fallo!" });
  }
};

//DELETE
export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
    return res.status(404).send({ message: "No se encontro una propiedad!" });
  }
  try {
    await property.destroy();
    res.send("La propiedad fue eliminado!!");
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).send({ message: "Algo fallo!" });
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
/* export const getFeaturedProperties = async () => {
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
}; */

// Traer propiedades recientes
export const getRecentProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [["createdAt", "DESC"]],
            limit: 9,
        });
        res.json(properties);
    } catch (error) {
        console.error("Error al obtener propiedades recientes: ", error);
        res.status(500).json({ message: "Error al obtener propiedades recientes" });
    }
}

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

export const getSearchProperties = async (req, res) => {
    try {
        const {
            address,
            minPrice,
            maxPrice,
            keyword,
            propertyType,
            rentPreference,
            status,
            page = 1,
            limit = 10
        } = req.query;

        const where = {};
        
        if (address) {
            where.address = { [Op.like]: `%${address}%` };
        }

        if (minPrice && maxPrice) {
            where.rentPrice = { [Op.between]: [minPrice, maxPrice] };
        }

        if (propertyType) {
            where.propertyType = propertyType;
        }

        if (rentPreference) {
            where.rentPreference = rentPreference;
        }

        if (status) {
            where.status = status;
        }

        if (keyword) {
            where[Op.or] = [
                { address: { [Op.like]: `%${keyword}%` } },
                { propertyType: { [Op.like]: `%${keyword}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Property.findAndCountAll({
            where,
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [["createdAt", "DESC"]]
        });

        res.json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            properties: rows
        });
    } catch (error) {
        console.error("Error en búsqueda:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}


export const requestNewProperty = async (req,res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if(!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const propertyData = {
      ...req.body,
      ownerId: user.id,
      status: "pending"
    };

    const newProperty = await Property.create(propertyData);

    res.status(200).json({ property: newProperty });
  } catch (error) {
    console.error("Eror al solicitar nueva propiedad: ", error);
    res.status(500).json({ message: "Eror al enviar la solicitud." });
  }
};

//ver si sirve
const validatePropertyData = (req) => {
  const result = {
    error: false,
    message: "",
  }
}