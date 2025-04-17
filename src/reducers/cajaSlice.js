import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCajasApi,
  addCajaApi,
  updateCajaApi,
  deleteCajaApi,
  activarCajaApi,
} from '../services/cajaServices';

export const fetchCajas = createAsyncThunk(
  'cajas/fetchCajas',
  async (idSucursal, { rejectWithValue }) => {
    try {
      const data = await fetchCajasApi(idSucursal);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCaja = createAsyncThunk(
  'cajas/addCaja',
  async ({ idSucursal, caja }, { rejectWithValue }) => {
    try {
      const data = await addCajaApi(idSucursal, caja);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCaja = createAsyncThunk(
  'cajas/updateCaja',
  async ({ idSucursal, id_caja, caja }, { rejectWithValue }) => {
    try {
      const data = await updateCajaApi(idSucursal, id_caja, caja);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCaja = createAsyncThunk(
  'cajas/deleteCaja',
  async ({ idSucursal, idCaja }, { rejectWithValue }) => {
    try {
      await deleteCajaApi(idSucursal, idCaja);
      return { idCaja };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const activarCaja = createAsyncThunk(
  'cajas/activarCaja',
  async ({ idSucursal, idCaja }, { rejectWithValue }) => {
    try {
      await activarCajaApi(idSucursal, idCaja);
      return { idCaja };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cajaSlice = createSlice({
  name: 'cajas',
  initialState: {
    cajas: [],
    caja: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCajas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCajas.fulfilled, (state, action) => {
        state.loading = false;
        state.cajas = action.payload || [];
      })
      .addCase(fetchCajas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCaja.fulfilled, (state, action) => {
        state.cajas.push(action.payload);
      })

      .addCase(updateCaja.fulfilled, (state, action) => {
        const index = state.cajas.findIndex(caja => caja.id === action.payload.id);
        if (index !== -1) {
          state.cajas[index] = action.payload;
        }
      })

      .addCase(deleteCaja.fulfilled, (state, action) => {
        state.cajas = state.cajas.filter(caja => caja.id !== action.payload.idCaja);
      })

      .addCase(activarCaja.fulfilled, (state, action) => {
        state.cajas = state.cajas.filter(caja => caja.id !== action.payload.idCaja);
      });
  },
});

export default cajaSlice.reducer;
