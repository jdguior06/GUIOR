import api from '../utils/api'; 

export const fetchProductosVendidosApi = async (id) => {
  try {
    const response = await api.get(`/reportes/productos/caja-sesion/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener los productos vendidos');
  }
};

export const fetchProductosVendidosExcelApi = async (id) => {
  try {
    const response = await api.get(`/reportes/excel/caja-sesion/${id}`, {
      responseType: 'arraybuffer', // 👈 Esto es importante para recibir los datos en el formato correcto
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener los productos vendidos');
  }
};

export const fetchReporteProductosPorFechaApi = async (inicioFecha, finFecha) => {
  try {
    const response = await api.get('/reportes/productos/por-fecha', {
      params: { inicioFecha, finFecha },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener los productos vendidos por fecha");
  }
};

export const fetchProductosVendidosPorFechaExcelApi = async (inicioFecha, finFecha) => {
  try {
    const response = await api.get(`/reportes/productos/excel/por-fecha`, {
      params: { inicioFecha, finFecha },
      responseType: 'arraybuffer', // 👈 Esto es importante para recibir los datos en el formato correcto
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener los productos vendidos');
  }
};