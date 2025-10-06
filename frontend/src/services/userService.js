import axios from "axios";

const API_URL = "http://localhost:3000";

export const getAllUsers = async (endpoint, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener datos: ", error);
    throw error;
  }
};

export const getUserById = async (id, endpoint = "users", token) => {
  try {
    const response = await axios.get(`${API_URL}/api/${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener: ", error);
    throw error;
  }
};

export const updateUser = async (id, endpoint = "users", userData, token) => {
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
    console.error("Error al actualizar: ", error);
    throw error;
  }
};

export const delUser = async (id, endpoint = "users", token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/${endpoint}/${id}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar logicamente el: ", error);
    throw error;
  }
};

export const blockUser = async (id, token) => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/users/${id}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error al desactivar: ", error);
    throw error;
  }
};
