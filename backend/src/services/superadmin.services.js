import { User } from "../models/User.js";

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const isSuperadmin = req.user.role === 'superadmin';

    if(isSuperadmin)
      return res.status(403).json({ message: "No podés bloquear tu propia cuenta de superadministrador." });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `Usuario ${user.isBlocked ? "bloqueado" : "desbloqueado"} correctamente` });
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};
