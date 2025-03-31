import api from '../utils/api';  

export const fetchUsuariosApi = async (searchTerm = "") => {
  try {
    const response = await api.get(`/user`, { params: { search: searchTerm } });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener los usuarios');
  }
};

export const fetchUsuarioApi = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el usuario');
  }
};

export const addUsuarioApi = async (usuario) => {
  try {
    const response = await api.post('/user', usuario);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear el usuario');
  }
};

export const updateUsuarioApi = async (id, usuario) => {
  try {
    const response = await api.patch(`/user/${id}`, usuario);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
  }
};

export const deactivateUsuarioApi = async (id) => {
  try {
    await api.patch(`/user/${id}/desactivar`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al desactivar el usuario');
  }
};

export const activateUsuarioApi = async (id) => {
  try {
    await api.patch(`/user/${id}/activar`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al activar el usuario');
  }
};
