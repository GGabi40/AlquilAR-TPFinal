import axios from "axios";

const API_URL = "http://localhost:3000/api/posts";

export const PostService = {
    updateStatus: async (id, status, token) => {
        const response = await axios.patch(
            `${API_URL}/${id}/status`,
            { status },
            { headers: {Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    deletePost: async (id, token) => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};