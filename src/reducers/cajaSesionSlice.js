import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aperturaCajaApi, cierreCajaApi, fetchCajasSesionApi, verificarSesionAbiertaApi } from '../services/cajaSesionService';
import { realizarVentaApi } from '../services/ventaService';

export const fetchCajasSesion = createAsyncThunk(
  'cajaSesion/fetchCajaSesion',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCajasSesionApi();
      // console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Acción para apertura de caja
export const aperturaCaja = createAsyncThunk(
  'cajaSesion/aperturaCaja',
  async ({ id_caja, monto }, { rejectWithValue }) => {
    try {
      const data = await aperturaCajaApi({ id_caja, monto });
      if (data.conflict) {
        return { conflict: true, sesionAbiertaId: data.sesionAbiertaId };
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Acción para cierre de caja
export const cierreCaja = createAsyncThunk(
  'cajaSesion/cierreCaja',
  async (idCajaSesion, { rejectWithValue }) => {
    try {
      const data = await cierreCajaApi(idCajaSesion);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Acción para verificar sesión abierta
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

// Acción para realizar venta
export const realizarVenta = createAsyncThunk(
  'cajaSesion/realizarVenta',
  async (ventaData, { rejectWithValue }) => {
    try {
      const data = await realizarVentaApi(ventaData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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
    venta: {
      loading: false,
      error: null,
      data: null,
    },
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

      // Cierre de caja
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

      // Verificar sesión abierta
      .addCase(verificarSesionAbierta.fulfilled, (state, action) => {
        state.cajaSesion = action.payload || null;
      })

      // Realizar venta
      .addCase(realizarVenta.pending, (state) => {
        state.venta.loading = true;
        state.venta.error = null;
      })
      .addCase(realizarVenta.fulfilled, (state, action) => {
        state.venta.loading = false;
        state.venta.data = action.payload;
      })
      .addCase(realizarVenta.rejected, (state, action) => {
        state.venta.loading = false;
        state.venta.error = action.payload;
      });
  },
});

export default cajaSesionSlice.reducer;

