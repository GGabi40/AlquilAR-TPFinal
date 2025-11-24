import { Rental } from "../models/Rental.js";
import { Post } from "../models/Post.js";
import { User } from '../models/User.js';
import { Property } from '../models/Property.js';

export const getRentalById = async (req,res) => {
    try {
        const { id } = req.params;
        const rental = await Rental.findByPk(id, {
            include: [
                { model: Post, as: "post"},
                { model: Property },
                { model: User, as: "tenant", attributes: ["id", "name", "surname", "email"]}
            ]
        });

        if(!rental) return res.status(404).json({ message: "No se encontró el alquiler" });

        res.status(200).json(rental);
    } catch (error) {
        console.error("Error al obtener alquiler:", error);
        res.status(500).json({ message: "Error al obtener alquiler." });
    }
};

export const getRentalsByTenant = async (req,res) => {
    try {
        const tenantId = req.user.id;

        const rentals = await Rental.findAll({
            where: { tenantId },
            include: [
                { model: Post, as: "post" },
                { model: Property }
            ]
        });

        if(!rentals.length) 
            return res.status(404).json({ message: "No tenés alquileres registrados." });

        res.status(200).json(rentals);
    } catch (error) {
        console.error("Error al obtener alquileres de inquilino: ", error);
        res.status(500).json({ message: "Error al obtener alquileres de inquilino." });
    }
};


/* Owner */
export const createRental = async (req, res) => {
  try {
    const { postId, tenantId, startDate, endDate, totalPrice } = req.body;
    const ownerId = req.user.id;

    const post = await Post.findByPk(postId, { include: Property });

    if (!post)
      return res.status(404).json({ message: "No se encontró la publicación." });

    if (post.Property.ownerId !== ownerId)
      return res.status(403).json({ message: "Esta propiedad no te pertenece." });

    const existingRental = await Rental.findOne({
      where: { postId, status: ["pending", "active"] }
    });

    if (existingRental)
      return res.status(400).json({ message: "Esta propiedad ya está alquilada." });

    const newRental = await Rental.create({
      postId,
      propertyId: post.Property.idProperty,
      tenantId,
      startDate,
      endDate,
      totalPrice,
      status: "active"
    });

    post.status = "rented";
    await post.save();

    res.status(201).json({ message: "Alquiler creado correctamente.", rental: newRental });
  } catch (error) {
    console.error("Error al crear alquiler:", error);
    res.status(500).json({ message: "Error al crear alquiler." });
  }
};



export const updateRentalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userRole = req.user.role;

        const rental = await Rental.findByPk(id, {
            include: [{ model: Post, include: [Property] }]
        });

        if(!rental) return res.status(404).json({ message: "Alquiler  no encontrado." });

        const validStatus = ["pending", "active", "finished"];

        if(!validStatus.includes(status)) return res.status(400).json({ message: "Status inválido." });

        const isOwner = rental.Post.Property.ownerId === req.user.id;
        const isSuperadmin = userRole === "superadmin";

        if (!isOwner && !isSuperadmin) return res.status(403).json({ message: "No tenés autorización para esto." });

        rental.status = status;
        await rental.save();

        res.status(200).json({ message: "Alquiler actualizado con éxito.", rental });
    } catch (error) {
        console.error("Error al actualizar alquiler: ", error);
        res.status(500).json({ message: "Error al actualizar alquiler." });
    }
};

export const getRentalsByOwner = async (req,res) => {
    try {
        const ownerId = req.user.id;

        const rentals = await Rental.findAll({
            include: [
                {
                    model: Property,
                    where: { ownerId },
                    include: [
                        { model: Post, as: "post"},
                        { model: User, as: "tenant", attributes: ["id", "name", "surname", "email"]}
                    ]
                }
            ]
        });

        if (!rentals.length) return res.status(404).json({ message: "No hay alquileres asociados a tus propiedades." });

        res.status(200).json(rentals);
    } catch (error) {
        console.error("Error al obtener alquileres del propietario: ", error);
        res.status(500).json({ message: "Error al obtener alquileres del propietario." });
    }
};

export const finishRental = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const rental = await Rental.findByPk(id, {
            include: [{ model: Post, include: [Property] }]
        });

        if(!rental) return res.status(404).json({ message: "Alquiler no encontrado." });

        const isOwner = rental.Post.Property.ownerId === userId;
        const isSuperadmin = userRole === "superadmin";

        if(!isOwner && !isSuperadmin) return res.status(403).json({ message: "No tenés autorización para esta acción." });

        rental.status = "finished";
        await rental.save();

        rental.Post.status = "active";
        await rental.Post.save();

        res.status(200).json({ message: "Alquiler finalizado correctamente. Publicación activada." });
    } catch (error) {
        console.error("Error al finalizar alquiler:", error);
        res.status(500).json({ message: "Error al finalizar alquiler." });
    }
};

export const getActiveRentals = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let filter = {};

    if (role === "owner") {
      filter = {
        include: [
          {
            model: Property,
            where: { ownerId: userId },
            include: [{ model: User, as: "tenant", attributes: ["id", "name", "surname", "email"] }],
          },
        ],
      };
    } else if (role === "tenant") {
      filter = {
        where: { tenantId: userId },
        include: [{ model: Property }],
      };
    } else if (role === "superadmin") {
      filter = {
        include: [
          { model: Property },
          { model: User, as: "tenant", attributes: ["id", "name", "surname", "email"] },
        ],
      };
    }

    const rentals = await Rental.findAll({
      where: { status: "active" },
      ...filter,
    });

    if (!rentals.length)
      return res.status(404).json({ message: "No hay alquileres activos." });

    res.status(200).json(rentals);
  } catch (error) {
    console.error("Error al obtener alquileres activos:", error);
    res.status(500).json({ message: "Error al obtener alquileres activos." });
  }
};
