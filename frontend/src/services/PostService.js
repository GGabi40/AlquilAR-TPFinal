import axios from "axios";

const API_URL =
  import.meta.env.VITE_BACKEND_ROUTE || "http://localhost:3000/api";

export const PostService = {
  getPostById: async (id, token) => {
    const response = await axios.get(`${API_URL}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getPostsByOwner: async (ownerId, token) => {
    const response = await axios.get(`${API_URL}/posts/owner/${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateStatus: async (id, status, token) => {
    const response = await axios.patch(
      `${API_URL}/posts/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  updatePost: async (id, data, token) => {
    const response = await axios.put(`${API_URL}/posts/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deletePost: async (id, token) => {
    const response = await axios.delete(`${API_URL}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
