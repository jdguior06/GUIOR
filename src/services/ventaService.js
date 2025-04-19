import api from '../utils/api';

export const realizarVentaApi = async (ventaData) => {
  try {
    const response = await api.post('/venta', ventaData);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.errors?.join(', ')
      || error.message 
      || 'Error al realizar la venta';
    throw new Error(errorMessage);
  }
};

export const realizarPedidoApi = async (ventaData) => {
  try {
    const response = await api.post('/venta/pedido', ventaData);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.errors?.join(', ')
      || error.message 
      || 'Error al realizar el pedido';
    
    throw new Error(errorMessage);
  }
};

export const actualizarPedidoApi = async (id, ventaData) => {
  try {
    const response = await api.patch(`/venta/pedido/actualizar/${id}`, ventaData);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Error al actualizar el pedido';
    throw new Error(errorMessage);
  }
};

export const completarPedidoApi = async (id) => {
  try {
    const response = await api.patch(`/venta/pedido/completar/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Error al cancelar el pedido';
    throw new Error(errorMessage);
  }
};

export const pagarPedidoApi = async (id, metodosPago) => {
  try {
    const response = await api.patch(`/venta/pedido/pagar/${id}`, metodosPago);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Error al pagar el pedido';
    throw new Error(errorMessage);
  }
};

export const cancelarPedidoApi = async (id) => {
  try {
    const response = await api.patch(`/venta/pedido/cancelar/${id}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Error al cancelar el pedido';
    throw new Error(errorMessage);
  }
};

export const obtenerVentasApi = async () => {
  try {
    const response = await api.get('/venta');
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener las ventas:", error.response?.data);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Error al obtener las ventas'
    );
  }
};

export const obtenerVentaPorIdApi = async (id) => {
  try {
    const response = await api.get(`/venta/${id}`);
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener la venta:", error.response?.data);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Error al obtener la venta'
    );
  }
};

export const obtenerVentaPorSesionDeCajaApi = async (id) => {
  try {
    const response = await api.get(`/venta/CajaSesion/${id}`);
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener las ventas:", error.response?.data);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Error al obtener las ventas'
    );
  }
};