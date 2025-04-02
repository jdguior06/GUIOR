import api from '../utils/api';
import { showNotification } from '../utils/toast';

export const registerUser = async (usuarioDTO, planDTO) => {
  try {
    const response = await api.post("/suscriptor/crear", {
      usuarioDTO,
      planDTO,
    });

    showNotification.success("Registro exitoso");
    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error en el registro";
    showNotification.error(errorMessage);
    return { success: false, message: errorMessage };
  }
};
