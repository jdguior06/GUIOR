import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsuariosApi,
  fetchUsuarioApi,
  addUsuarioApi,
  updateUsuarioApi,
  deactivateUsuarioApi,
  activateUsuarioApi,
} from '../services/usuarioServices';

export const fetchUsuarios = createAsyncThunk('usuarios/fetchUsuarios', async (searchTerm = "", { rejectWithValue }) => {
  try {
    const data = await fetchUsuariosApi(searchTerm);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchUsuario = createAsyncThunk('usuarios/fetchUsuario', async (id, { rejectWithValue }) => {
  try {
    const data = await fetchUsuarioApi(id);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addUsuario = createAsyncThunk('usuarios/addUsuario', async (usuario, { rejectWithValue }) => {
  try {
    const data = await addUsuarioApi(usuario);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUsuario = createAsyncThunk('usuarios/updateUsuario', async ({ id, usuario }, { rejectWithValue }) => {
  try {
    const data = await updateUsuarioApi(id, usuario);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deactivateUsuario = createAsyncThunk('usuarios/deactivateUsuario', async (id, { rejectWithValue }) => {
  try {
    await deactivateUsuarioApi(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const activateUsuario = createAsyncThunk('usuarios/activateUsuario', async (id, { rejectWithValue }) => {
  try {
    await activateUsuarioApi(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const usuarioSlice = createSlice({
  name: 'usuarios',
  initialState: {
    usuarios: [],
    usuario: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUsuario.fulfilled, (state, action) => {
        state.usuario = action.payload;
        state.loading = false;
      })

      .addCase(addUsuario.fulfilled, (state, action) => {
        state.usuarios.push(action.payload);
      })

      .addCase(updateUsuario.fulfilled, (state, action) => {
        const index = state.usuarios.findIndex(usuario => usuario.id === action.payload.id);
        if (index !== -1) {
          state.usuarios[index] = action.payload;
        }
      })

      .addCase(deactivateUsuario.fulfilled, (state, action) => {
        state.usuarios = state.usuarios.map(usuario => 
          usuario.id === action.payload ? { ...usuario, activo: false } : usuario
        );
      })

      .addCase(activateUsuario.fulfilled, (state, action) => {
        state.usuarios = state.usuarios.map(usuario => 
          usuario.id === action.payload ? { ...usuario, activo: true } : usuario
        );
      })

      .addCase(deactivateUsuario.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(activateUsuario.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default usuarioSlice.reducer;
