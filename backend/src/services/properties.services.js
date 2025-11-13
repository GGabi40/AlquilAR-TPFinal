import { Property } from "../models/Property.js";
import { Op } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "../models/User.js";
import { PropertyLocality } from "../models/PropertyLocality.js";
import { PropertyProvince } from "../models/PropertyProvince.js";
import { PropertyDetails } from "../models/PropertyDetails.js";
import { PropertyVideos } from "../models/PropertyVideos.js";
import { PropertyImages } from "../models/PropertyImages.js";
import { PropertyDocuments } from "../models/PropertyDocuments.js";

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [
        { model: PropertyLocality, as: "locality" },
        { model: PropertyProvince, as: "province" },
        {
          model: PropertyDetails,
          include: [{ model: PropertyImages }, { model: PropertyVideos }],
        },
        { model: PropertyDocuments },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!properties || properties.length === 0)
      return res
        .status(404)
        .json({ message: "No hay propiedades disponibles." });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener propiedades" });
  }
};

export const getSearchProperties = async (req, res) => {
  try {
    const { query, province, type, minPrice, maxPrice } = req.query;

    const where = {};

    if (query) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { location: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
      ];
    }

    if (province) where.province = { [Op.like]: `%${province}%` };
    if (type) where.type = { [Op.like]: `%${type}%` };
    if (minPrice)
      where.price = { ...(where.price || {}), [Op.gte]: parseFloat(minPrice) };
    if (maxPrice)
      where.price = { ...(where.price || {}), [Op.lte]: parseFloat(maxPrice) };

    const results = await Property.findAll({ where });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar propiedades" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        { model: PropertyLocality, as: "locality" },
        { model: PropertyProvince, as: "province" },
        { model: PropertyDetails,
          include: [
            { model: PropertyImages },
            { model: PropertyVideos }
          ]
        }
      ]
    });

    if (!property)
      return res.status(404).json({ message: "Propiedad no encontrada" });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la propiedad" });
  }
};

//PUT-UPDATE
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [{ model: PropertyDetails }]
    });

    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    await property.update({
      propertyType: req.body.propertyType,
      rentPrice: req.body.rentPrice,
      expensesPrice: req.body.expensesPrice,
      status: req.body.status || property.status,
      rentPreference: req.body.rentPreference,
      address: req.body.address,
      provinceId: req.body.provinciaId || property.provinceId,
      localityId: req.body.localidadId || property.localityId,
    });

    if (property.PropertyDetail) {
      await property.PropertyDetail.update({
        numRooms: req.body.numRooms,
        numBedrooms: req.body.numBedrooms,
        numBathrooms: req.body.numBathrooms,
        propertyAge: req.body.propertyAge,
        totalArea: req.body.totalArea,
      });
    }

    return res.json({ message: "Propiedad actualizada", property });

  } catch (error) {
    console.error("ERROR UPDATE PROPERTY:", error);
    return res.status(500).json({ message: "Error al actualizar propiedad" });
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
    return res.status(500).send({ message: "Algo fallo!" });
  }
};

// Traer propiedades de un dueño
export const getPropertiesByOwner = async (ownerId) => {
  try {
    return await Property.findAll({ where: { ownerId } });
  } catch (error) {
    throw new Error("Error al obtener propiedades");
  }
};


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
        propertyId: property.idProperty,
      },
      { transaction: t }
    );

    // Guarda imágenes
    if (req.body.images?.length) {
      const imageRecords = req.body.images.map((url) => ({
        URLImages: url,
        alt: "Imagen de la propiedad",
        propertyDetailsId: details.idPropertyDetails,
      }));
      await PropertyImages.bulkCreate(imageRecords, { transaction: t });
    }

    // Guarda Videos
    if (req.body.video) {
      await PropertyVideos.create({
        URLVideo: req.body.video,
        propertyDetailsId: details.idPropertyDetails,
      },
      { transaction: t })
    }    

    // Guarda documentos
    if(req.body.documents?.length){
      const docRecords = req.body.documents.map((url) => ({
        URLDocument: url,
        propertyId: property.idProperty,        
      }));
      await PropertyDocuments.bulkCreate(docRecords, { transaction: t });
    }

    await t.commit();
    res.status(200).json({ property: { ...property.toJSON(), details } });
  } catch (error) {
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
  };
};
