import { faL } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const favoriteService = {
    async getFavorites(token) {
        try {
            const { data } = await axios.get("/favorites", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { succes: true, data };
        } catch (err) {
            return {
                succes: false,
                message: err.response?.data?.error || "Error al obtener tus favoritos.",
            };
        }
    },
    async addFavorite(propertyId, token) {
        try {
            const { data } = await axios.post(
                `/favorites/${propertyId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
                succes: true,
                data,
                message: "Propiedad agregada a favoritos.",
            };
        } catch (err) {
            return {
                succes: false,
                message: err.response?.data?.error || "No se pudo agregar a favoritos.",
            };
        }
    },
    async removeFavorite(propertyId, token) {
        try {
            const { data } = await axios.delete(`/favorites/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return {
                success: true,
                data,
                message: "Propiedad eliminada de favoritos.",
            };
        } catch (err) {
            return {
                success: false,
                message:
                    err.response?.data?.error || "No se pudo eliminar de favoritos.",
            };
        }
    },
};