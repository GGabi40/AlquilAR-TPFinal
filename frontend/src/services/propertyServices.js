import axios from "axios";

const API_URL = "/properties";

const PropertyServices = {
    getAllProperties: async (token) => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error al traer propiedades:", error);
            throw error;
        }
    },

    getPropertyById: async (id, token) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error al traer propiedades:", error);
            throw error;
        }
    },

    updateApprovalStatus: async (id, newStatus, token) => {
        try {
            const response = await axios.put(
                `${API_URL}/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Error actualizando estado:", error);
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
            console.error("Erorr al eliminar propiedad:", error);
            throw error;
        }
    },

    approveProperty: async (id, token) => {
        return PropertyServices.updateApprovalStatus(id, "approved", token);
    },

    rejectProperty: async (id, token) => {
        return PropertyServices.updateApprovalStatus(id, "rejected", token)
    }
};

export default PropertyServices;
export const { getAllProperties, approveProperty, rejectProperty, deleteProperty } = PropertyServices;