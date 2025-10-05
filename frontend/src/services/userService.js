import axios from "axios";

const API_URL = "http://localhost:3000";

export const getById = async (id, endpoint = "users", token) => {
  try {
    const response = await axios.get(`${API_URL}/api/${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario: ", error);
    throw error;
  }
};

export const update = async (id, endpoint = "users", userData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/${endpoint}/${id}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario: ", error);
    throw error;
  }
};

export const deactivate = async (id, token) => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/users/${id}/deactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error al desactivar usuario: ", error);
    throw error;
  }
};

export const del = async (id, endpoint = "users", token) => {
  try {
    const reponse = await axios.delete(`${API_URL}/api/${endpoint}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar logicamente el usuario: ", error);
    throw error;
  }
};
