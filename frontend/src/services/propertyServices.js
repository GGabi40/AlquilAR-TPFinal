import axios from "axios";

const API_URL = "/properties";

const PropertyServices = {
  getAllProperties: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al traer propiedades:", error);
      throw error;
    }
  },

  getPropertyById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al traer propiedad:", error);
      throw error;
    }
  },

  getPropertiesByOwner: async (ownerId, token) => {
    try {
      const response = await axios.get(`${API_URL}/owner/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al traer propiedades del dueño:", error);
      throw error;
    }
  },

  getFeaturedProperties: async () => {
    try {
      const response = await axios.get(`${API_URL}/featured`);
      return response.data;
    } catch (error) {
      console.error("Error al traer destacadas:", error);
      throw error;
    }
  },

  getRecentProperties: async () => {
    try {
      const response = await axios.get(`${API_URL}/recent`);
      return response.data;
    } catch (error) {
      console.error("Error al traer recientes:", error);
      throw error;
    }
  },

  searchProperties: async (queryParams) => {
    try {
      const response = await axios.get(`${API_URL}/search`, { params: queryParams });
      return response.data;
    } catch (error) {
      console.error("Error en búsqueda de propiedades:", error);
      throw error;
    }
  },

  createProperty: async (propertyData, token) => {
    try {
      const response = await axios.post(API_URL, propertyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear propiedad:", error);
      throw error;
    }
  },

  updateProperty: async (id, updatedData, token) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar propiedad:", error);
      throw error;
    }
  },

  deleteProperty: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      throw error;
    }
  },

  /* toggleFeaturedProperty: async (id, token) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/featured`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al destacar propiedad:", error);
      throw error;
    }
  }, */

  requestNewProperty: async (propertyData, token) => {
    try {
      const response = await axios.post(`${API_URL}/request`, propertyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al solicitar nueva propiedad:", error);
      throw error;
    }
  },

  approveProperty: async (id, token) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al aprobar propiedad:", error);
      throw error;
    }
  },

  rejectProperty: async (id, token) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al rechazar propiedad:", error);
      throw error;
    }
  },
};

export default PropertyServices;

export const {
  getAllProperties,
  getPropertyById,
  getPropertiesByOwner,
  getFeaturedProperties,
  getRecentProperties,
  searchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFeaturedProperty,
  requestNewProperty,
  approveProperty,
  rejectProperty,
} = PropertyServices;
