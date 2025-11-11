import { Property } from "../models/Property.js";
import { User } from "../models/User.js";
import nodemailer from 'nodemailer';

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    const isSuperadmin = user.role === "superadmin";
    if (isSuperadmin)
      return res.status(403).json({
        message: "No podés bloquear una cuenta de superadministrador.",
      });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `Usuario ${
        user.isBlocked ? "bloqueado" : "desbloqueado"
      } correctamente.`,
    });
  } catch (error) {
    console.error("Error al bloquear usuario:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    const isOwner = parseInt(id) === req.user.id;

    if (req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "No tenés permisos para cambiar roles." });
    }

    if (isOwner) {
      return res
        .status(403)
        .json({ message: "No podés editar tu propio rol." });
    }

    user.role = role ?? user.role;
    await user.save();

    res
      .status(200)
      .json({ message: "Rol de usuario actualizado correctamente.", user });
  } catch (error) {
    console.error("Error al actualizar rol de usuario:", error);
    res.status(500).json({ message: "Error al actualizar rol de usuario." });
  }
};

export const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "surname", "email"],
        },
      ],
    });

    if (!property)
      return res.status(404).json({ message: "Propiedad no encontrada." });

    if (property.status === "available")
      return res.status(400).json({ message: "La propiedad ya está aprobada" });

    property.status = "available";
    
    const ownerEmail = property.owner?.email;

    if (ownerEmail) {
      mailSent("¡Tu solicitud fue aprobada! 🎉 | AlquilAR",
      `
  <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 40px;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h1 style="color: #007bff; font-style: italic;">AlquilAR</h1>
      <h2 style="color: #28a745;">¡Felicidades, tu solicitud fue aprobada! 🎉</h2>
      <p style="font-size: 16px; color: #333;">
        Hemos revisado y aprobado la documentación de tu propiedad. 
        Ahora tu publicación se encuentra <strong>visible en la plataforma</strong> para que los inquilinos puedan verla.
      </p>
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        ¡Gracias por confiar en <strong>AlquilAR</strong>!<br>
        <em>El equipo de AlquilAR</em>
      </p>
    </div>
  </div>
  `, ownerEmail);
    };

    await property.save();

    const owner = await User.findByPk(property.ownerId);

    if (owner && owner.role === "user") {
      owner.role = "owner";
      await owner.save();
    }

    res.json({ property });
  } catch (error) {
    console.error("Error al aprobar propiedad: ", error);
    res.status(500).json({ message: "Error al aprobar propiedad." });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "surname", "email"],
        },
      ],
    });

    if (!property)
      return res.status(404).json({ message: "Propiedad no encontrada." });

    if (property.status === "rejected")
      return res
        .status(400)
        .json({ message: "La propiedad ya está rechazada" });

    property.status = "rejected";

    const ownerEmail = property.owner?.email;

  if (ownerEmail) {
    mailSent(
      "⚠️ Tu solicitud no fue aprobada | AlquilAR",
      `
  <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 40px;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h1 style="color: #007bff; font-style: italic;">AlquilAR</h1>
      <h2 style="color: #dc3545;">Tu solicitud no pudo ser aprobada</h2>
      <p style="font-size: 16px; color: #333;">
        Hemos revisado la documentación enviada y lamentablemente <strong>no cumple con los requisitos necesarios</strong> 
        para aprobar la publicación de tu propiedad.
      </p>
      <p style="font-size: 16px; color: #333;">
        Te recomendamos verificar que los archivos sean claros y estén actualizados antes de volver a enviarlos.
      </p> 
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        Si creés que se trata de un error, podés comunicarte con nuestro soporte <a href="${process.env.FRONTEND_URL}/contact-us">aquí</a>.<br>
        <em>El equipo de AlquilAR</em>
      </p>
    </div>
  </div>
  `, ownerEmail
    );
  }

    await property.save();

    res.json({ property });
  } catch (error) {
    console.error("Error al rechazar propiedad: ", error);
    res.status(500).json({ message: "Error al rechazar propiedad." });
  }
};

const mailSent = async (subject, msj, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AlquilAR" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: msj,
  });
};
