import axios from "axios";

const API_URL =
  import.meta.env.VITE_BACKEND_ROUTE || "http://localhost:3000/api";

export const rentalService = {
  createRental: async (data, token) => {
    const response = await axios.post(`${API_URL}/rentals`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMyRent: async (token) => {
    const res = await axios.get(`${API_URL}/rentals/tenant/my-rentals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
