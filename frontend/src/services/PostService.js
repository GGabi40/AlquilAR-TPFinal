import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_ROUTE || "http://localhost:3000/api";

export const PostService = {
    updateStatus: async (id, status, token) => {
        const response = await axios.patch(
            `${API_URL}/posts/${id}/status`,
            { status },
            { headers: {Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    deletePost: async (id, token) => {
        const response = await axios.delete(`${API_URL}/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};