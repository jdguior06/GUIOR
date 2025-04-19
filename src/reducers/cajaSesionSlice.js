import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aperturaCajaApi, cierreCajaApi, fetchCajasSesionApi, verificarSesionAbiertaApi } from '../services/cajaSesionService';

export const fetchCajasSesion = createAsyncThunk(
  'cajaSesion/fetchCajaSesion',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCajasSesionApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const aperturaCaja = createAsyncThunk(
  'cajaSesion/aperturaCaja',
  async ({ id_caja, monto }, { rejectWithValue }) => {
    try {
      const data = await aperturaCajaApi({ id_caja, monto });
      if (data.conflict) {
        return { conflict: true, sesion: data.sesionAbiertaId };
      }
      return { sesion: data};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cierreCaja = createAsyncThunk(
  'cajaSesion/cierreCaja',
  async (idCajaSesion, { rejectWithValue }) => {
    try {
      const data = await cierreCajaApi(idCajaSesion);
      return { sesion: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verificarSesionAbierta = createAsyncThunk(
  'cajaSesion/verificarSesionAbierta',
  async (idCaja, { rejectWithValue }) => {
    const { status, data, message } = await verificarSesionAbiertaApi(idCaja);

    if (status === 200) {
      return { sesion: data, mismaSesion: true };
    } else if (status === 403) {
      return rejectWithValue({ mismaSesion: false, message: 'Sesión abierta por otro usuario' });
    } else if (status === 204) {
      return { sesion: null, mismaSesion: true };
    } else {
      return rejectWithValue({ mismaSesion: null, message });
    }
  }
);

const cajaSesionSlice = createSlice({
  name: 'cajaSesion',
  initialState: {
    cajaSesiones: [],
    cajaSesion: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCajasSesion.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCajasSesion.fulfilled, (state, action) => {
        state.loading = false;
        state.cajaSesiones = action.payload || [];
      })
      .addCase(fetchCajasSesion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(aperturaCaja.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(aperturaCaja.fulfilled, (state, action) => {
        state.loading = false;
        state.cajaSesion = action.payload;
      })
      .addCase(aperturaCaja.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cierreCaja.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cierreCaja.fulfilled, (state) => {
        state.loading = false;
        state.cajaSesion = null;
      })
      .addCase(cierreCaja.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verificarSesionAbierta.fulfilled, (state, action) => {
        state.cajaSesion = action.payload || null;
      });
  },
});

export default cajaSesionSlice.reducer;

