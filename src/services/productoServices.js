import api from '../utils/api'; 

export const fetchProductosApi = async () => {
  try {
    const response = await api.get('/producto');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener productos');
  }
};

export const fetchProductosActivosApi = async () => {
  try {
    const response = await api.get('/producto/activos');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener productos');
  }
};

export const fetchProductoApi = async (id) => {
  try {
    const response = await api.get(`/producto/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener producto');
  }
};

export const addProductoApi = async (producto) => {
  try {
    const response = await api.post('/producto', producto);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al agregar producto');
  }
};

export const updateProductoApi = async (id, producto) => {
  try {
    const response = await api.patch(`/producto/${id}`, producto);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar producto');
  }
};

export const desactivarProductoApi = async (id) => {
  try {
    const response = await api.patch(`/producto/${id}/desactivar`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar producto');
  }
};

export const activarProductoApi = async (id) => {
  try {
    const response = await api.patch(`/producto/${id}/activar`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al activar producto');
  }
};

export const fetchProductosConsolidadosApi = async (idSucursal) => {
  try {
    const response = await api.get(`/producto/consolidado/${idSucursal}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener productos consolidados');
  }
};