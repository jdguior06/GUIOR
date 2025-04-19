import api from '../utils/api';

export const fetchCajasSesionApi = async () => {
  try {
    const response = await api.get(`/caja-sesion`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener las sesiones de las cajas');
  }
};

// Apertura de caja
export const aperturaCajaApi = async ({ id_caja, monto }) => {
  try {
    const response = await api.post('/caja-sesion/apertura', { id_caja, monto });
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 409) {
      return { conflict: true, sesionAbiertaId: error.response.data.data.id };
    }
    throw new Error(error.response?.data?.message || 'Error al abrir la caja');
  }
};

// Cierre de caja
export const cierreCajaApi = async (idCajaSesion) => {
  try {
    const response = await api.patch(`/caja-sesion/${idCajaSesion}/cierre`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cerrar la caja');
  }
};

export const verificarSesionAbiertaApi = async (idCaja) => {
  try {
    const response = await api.get(`/caja-sesion/verificar-sesion/${idCaja}`);
    return { status: response.status, data: response.data.data }; // Devuelve el status y data
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Error al verificar la sesión';
    return { status, message }; // Maneja el error con un status y mensaje
  }
};