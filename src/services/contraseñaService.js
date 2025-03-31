import api from "../utils/api"

export const cambiarContrseña = async (contraseñaDto) => {
    try {
        const response = await api.patch("/user/cambiar-contraseña", contraseñaDto);
        return response.data.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 
            error.response?.data?.errors?.join(", ") || 
            "Error al cambiar la contraseña";
        throw new Error(errorMessage);
    }
} 