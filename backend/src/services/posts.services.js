import { Post } from "../models/Post.js";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

export const assertPostOwner = (post, user) => {
  const isOwner = post.Property.ownerId === user.id;
  const isSuperadmin = user.role === "superadmin";

  if (!isOwner && !isSuperadmin) {
    const error = new Error("No tenés autorización para modificar este post.");
    error.status = 403;
    throw error;
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Property,
          include: [
            { model: User, attributes: ["id"] }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    if (!posts.length)
      return res.status(200).json([]);

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

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: Property
    });

    if (!post)
      return res.status(404).json({ message: "Publicación no encontrada." });

    assertPostOwner(post, req.user);

    const { title, description, status } = req.body;

    post.title = title ?? post.title;
    post.description = description ?? post.description;
    post.status = status ?? post.status;

    await post.save();

    res.status(200).json({ message: "Post actualizado con éxito.", post });
  } catch (error) {
    console.error("Error al actualizar publicación:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al actualizar publicación" });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["active", "paused", "rented"];
    if (!validStatus.includes(status))
      return res.status(400).json({ message: "Status inválido." });

    const post = await Post.findByPk(id, { include: Property });
    if (!post)
      return res.status(404).json({ message: "Publicación no encontrada." });

    assertPostOwner(post, req.user);

    post.status = status;
    await post.save();

    res.status(200).json({ message: "Status actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar status:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al actualizar status" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, { include: Property });

    if (!post)
      return res.status(404).json({ message: "Publicación no encontrada." });

    assertPostOwner(post, req.user);

    await post.destroy();

    res.status(200).json({ message: "Publicación eliminada con éxito." });
  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al eliminar publicación" });
  }
};


export const getPostsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (req.user.id != ownerId && req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "No tenés autorización para ver estos posts."
      });
    }

    const posts = await Post.findAll({
      include: [
        {
          model: Property,
          where: { ownerId },
          include: [
            {
              model: User,
              as: "owner",
              attributes: ["id", "name", "surname", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al buscar publicaciones de propietario:", error);
    res
      .status(500)
      .json({ message: "Error al buscar publicaciones de propietario" });
  }
};

export const searchPosts = async (query) => {
  return await Post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
    include: [{ model: Property }],
  });
};

