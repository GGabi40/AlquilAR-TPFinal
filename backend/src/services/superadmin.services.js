import { User } from "../models/User.js";

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const isSuperadmin = user.role === "superadmin";
    if (isSuperadmin)
      return res.status(403).json({ message: "No podés bloquear una cuenta de superadministrador." });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `Usuario ${user.isBlocked ? "bloqueado" : "desbloqueado"} correctamente.` });
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
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const isOwner = parseInt(id) === req.user.id;

    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "No tenés permisos para cambiar roles." });
    }

    if (isOwner) {
      return res.status(403).json({ message: "No podés editar tu propio rol." });
    }

    user.role = role ?? user.role;
    await user.save();

    res.status(200).json({ message: "Rol de usuario actualizado correctamente.", user });
  } catch (error) {
    console.error("Error al actualizar rol de usuario:", error);
    res.status(500).json({ message: "Error al actualizar rol de usuario." });
  }
};