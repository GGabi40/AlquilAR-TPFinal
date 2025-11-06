import { sequelize } from "../config/db.js";
import { User } from "../models/User.js";
import { Property } from "../models/Property.js";
import { PropertyDetails } from "../models/PropertyDetails.js";
import { PropertyLocality } from "../models/PropertyLocality.js";
import { PropertyProvince } from "../models/PropertyProvince.js";
import { PropertyImages } from "../models/PropertyImages.js";
import { PropertyVideos } from "../models/PropertyVideos.js";
import { PropertyDocuments } from "../models/PropertyDocuments.js";


export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [
        { model: User, as: "owner", attributes: ["id", "email"] },
        { model: PropertyDetails },
        { model: PropertyLocality, as: "locality" },
        { model: PropertyProvince, as: "province" },
        { model: PropertyDetails,
          include: [ { model: PropertyImages }, { model: PropertyVideos }, { model: PropertyDocuments } ]
         }
      ],
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

    const propertyById = await Property.findByPk(id, {
      include: [
        { model: User, as: "owner", attributes: ["id", "email", "name"] },
        { model: PropertyDetails, 
          include: [
            { model: PropertyImages },
            { model: PropertyVideos },
            { model: PropertyDocuments }
          ]
        },
        { model: PropertyProvince, as: "province", attributes: ["provinceId", "name"] },
        { model: PropertyLocality, as: "locality", attributes: ["localityId", "name"] }
      ]
    });

    if (!propertyById)
      return res.status(404).json({ message: "No se encontro ninguna propiedad" });
    res.json(propertyById);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la propiedad" })
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


/* REQUEST */

export const requestNewProperty = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, { transaction: t });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    const existingProperty = await Property.findOne({
      where: { ownerId: user.id, address: req.body.address },
      transaction: t,
    });
    if (existingProperty) {
      await t.rollback();
      return res.status(400).json({
        message: "Ya existe una propiedad registrada con esta dirección.",
      });
    }

    // Crear o reutilizar provincia
    let province = await PropertyProvince.findOne({
      where: { name: req.body.nameP },
      transaction: t,
    });
    if (!province) {
      province = await PropertyProvince.create(
        { name: req.body.nameP },
        { transaction: t }
      );
    }

    // localidad
    let locality = await PropertyLocality.findOne({
      where: { name: req.body.nameL },
      transaction: t,
    });
    if (!locality) {
      locality = await PropertyLocality.create(
        { name: req.body.nameL },
        { transaction: t }
      );
    }

    const property = await Property.create(
      {
        propertyType: req.body.propertyType,
        rentPrice: req.body.rentPrice,
        expensesPrice: req.body.expensesPrice,
        rentPreference: req.body.rentPreference,
        address: req.body.address,
        ownerId: user.id,
        status: "pending",
        provinceId: province.provinceId,
        localityId: locality.localityId,
      },
      { transaction: t }
    );

    // Crear los detalles técnicos de la propiedad
    const details = await PropertyDetails.create(
      {
        numRooms: req.body.numRooms,
        numBedrooms: req.body.numBedrooms,
        numBathrooms: req.body.numBathrooms,
        propertyAge: req.body.propertyAge,
        totalArea: req.body.totalArea,
        propertyId: property.idProperty
      },
      { transaction: t }
    );

    // Crear imágenes / videos / documentos
    // cuando haya upload:
    /*
    const images = req.body.URLImages?.map((url) => ({
      URLImages: url,
      alt: "Imagen de la propiedad",
      propertyDetailsId: details.idPropertyDetails,
    }));
    if (images?.length) await PropertyImages.bulkCreate(images, { transaction: t });
    */

    await t.commit();

    res.status(200).json({ property, details, province, locality });
  } catch (error) {
    console.error("Error al solicitar nueva propiedad:", error);
    await t.rollback();
    res
      .status(500)
      .json({ message: "Error al crear la propiedad con sus relaciones." });
  }
};


const validatePropertyData = (req) => {
  const result = {
    error: false,
    message: "",
  }
}