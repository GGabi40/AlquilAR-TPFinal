import axios from "axios";

const API_URL = "http://localhost:3000";

export const getUserById = async (userId, token) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario: ', error);
        throw error;
    }
};