import { Post } from "../models/Post.js";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Property,
          include: [
            { model: User, attributes: ["id", "name", "surname", "email"] },
          ],
        },
      ],
    });

    if (!posts)
      return res.status(404).json({ message: "No hay publicaciones." });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al obtener publicaciones: ", error);
    res.status(500).json({ message: "Error al obtener publicaciones." });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, { include: [{ model: Property }] });

    if (!post)
      return res
        .status(404)
        .json({ message: "No se encontró esta publicación." });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error al obtener publicación: ", error);
    res.status(500).json({ message: "Error al obtener publicación." });
  }
};

/* Owner */
export const createPost = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "owner" && userRole !== "superadmin")
      return res
        .status(403)
        .json({
          message:
            "Solamente propietarios o administradores pueden crear publicaciones.",
        });

    const { propertyId, title, description, price, status } = req.body;

    const newPost = await Post.create({
      propertyId,
      title,
      description,
      price,
      status: status || "active",
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error al crear publicación:", error);
    res.status(500).json({ message: "Error al crear publicación" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, { include: Property });

    if (!post)
      return res
        .status(404)
        .json({ message: "No se encontró esta publicación." });

    const userId = req.user.id;
    const isOwner = post.Property.ownerId === userId;
    if (!isOwner)
      return res
        .status(403)
        .json({ message: "No tenés autorización para modificar este post." });

    const { title, description, price, status } = req.body;

    post.title = title ?? post.title;
    post.description = description ?? post.description;
    post.price = price ?? post.price;
    post.status = status ?? post.status;

    await post.save();

    res.status(200).json({ message: "Post actualizado con éxito." });
  } catch (error) {
    console.error("Error al actualizar publicación:", error);
    res.status(500).json({ message: "Error al actualizar publicación" });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, { include: Property });
    if (!post)
      return res.status(404).json({ message: "Publicación no encontrada." });

    const userId = req.user.id;
    const userRole = req.user.role;

    const isOwner = post.Property.ownerId === userId;
    const isSuperadmin = userRole === "superadmin";

    if (!isOwner && !isSuperadmin)
      return res.status(403).json({ message: "No tenés autorización para modificar este post." });

    
    const { status } = req.body;
    const validStatus = ["active", "paused", "rented"];

    if (!validStatus.includes(status))
      return res.status(400).json({ message: "Status inválido." });

    post.status = status;
    await post.save();

    res.status(200).json({ message: "Se cambió el Status con éxito." });
  } catch (error) {
    console.error("Error al actualizar status:", error);
    res.status(500).json({ message: "Error al actualizar status" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;
    const userRole = req.user.role;

    const post = await Post.findByPk(id, {
      include: { model: Property },
    });

    if (!post)
      return res.status(404).json({ message: "Publicación no encontrada." });

    const isOwner = post.Property.ownerId === userId;
    const isSuperadmin = userRole === "superadmin";

    if (!isOwner && !isSuperadmin)
      return res
        .status(403)
        .json({ message: "No tenés autorización para eliminar este post." });

    await Post.destroy({ where: { id } });

    res.status(200).json({ message: "Publicación eliminada con éxito." });
  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    res.status(500).json({ message: "Error al eliminar publicación" });
  }
};

export const getPostsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const posts = await Post.findAll({
      include: [
        {
          model: Property,
          where: { ownerId },
          include: [
            {
              model: User,
              attributes: ["id", "name", "surname", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (posts.length === 0)
      return res.status(404).json({ message: "Este propietario todavía no tiene publicaciones." });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al buscar publicaciones de propietario:", error);
    res.status(500).json({ message: "Error al buscar publicaciones de propietario" });
  }
};
