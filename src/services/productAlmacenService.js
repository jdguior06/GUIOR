import api from '../utils/api'; 

export const fetchProductosAlmacenApi = async (idAlmacen) => {
  try {
    const endpoint = idAlmacen ? `/almacen/${idAlmacen}/productos-almacen` : '/almacen/productos';
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error al obtener productos en almacenes'
    );
  }
};

export const fetchProductoAlmacenApi = async (id) => {
  try {
    const response = await api.get(`/productos-almacen/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error al obtener el producto en el almacén'
    );
  }
};

export const ajustarStockApi = async (id, cantidad) => {
  try {
    const response = await api.patch(`/almacen/${id}`,  cantidad );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error al actualizar el stock'
    );
  }
} 