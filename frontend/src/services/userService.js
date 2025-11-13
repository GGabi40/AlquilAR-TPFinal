import axios from "axios";
import { toastError } from "../components/ui/toaster/Notifications";

const API_URL = import.meta.env.VITE_BACKEND_ROUTE;

export const getAllUsers = async (endpoint, token) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toastError("Error al obtener datos: ", error);
    throw error;
  }
};

export const getUserById = async (id, endpoint = "users", token) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toastError("Error al obtener: ", error);
    throw error;
  }
};

export const updateUser = async (id, endpoint = "users", userData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${endpoint}/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toastError("Error al actualizar: ", error);
    throw error;
  }
};

export const deleteUser = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    ToastError("Error al eliminar logicamente el: ", error);
    throw error;
  }
};

export const blockUser = async (id, token) => {
  try {
    const res = await axios.patch(
      `${API_URL}/users/${id}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    toastError("Error al desactivar: ", error);
    throw error;
  }
};

export const updateUserRole = async (id, token, data) => {
  try {
    const res = await axios.patch(`${API_URL}/users/${id}/updateRole`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar rol: ", error);
    throw error;
  }
};

export const searchUsers = async (query, token) => {
  const res = await axios.get(`${API_URL}/users/search`, {
    params: { query },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
