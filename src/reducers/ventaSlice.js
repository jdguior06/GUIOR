import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { actualizarPedidoApi, cancelarPedidoApi, completarPedidoApi, obtenerVentaPorIdApi, obtenerVentaPorSesionDeCajaApi, obtenerVentasApi, pagarPedidoApi, realizarPedidoApi, realizarVentaApi } from '../services/ventaService';

export const realizarVenta = createAsyncThunk(
  'venta/realizarVenta',
  async (ventaData, { rejectWithValue }) => {
    try {
      const data = await realizarVentaApi(ventaData);
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const realizarPedido = createAsyncThunk(
  'venta/realizarPedido',
  async (ventaData, { rejectWithValue }) => {
    try {
      const data = await realizarPedidoApi(ventaData);
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const actualizarPedido = createAsyncThunk(
  'venta/actualizarPedido',
  async ({ id, ventaData }, { rejectWithValue }) => {
    try {
      const data = await actualizarPedidoApi(id, ventaData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const pagarPedido = createAsyncThunk(
  'venta/pagarPedido',
  async ({ id, metodosPago }, { rejectWithValue }) => {
    try {
      const data = await pagarPedidoApi(id, metodosPago);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelarPedido = createAsyncThunk(
  'venta/cancelarPedido',
  async ( id, { rejectWithValue }) => {
    try {
      const data = await cancelarPedidoApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const completarPedido = createAsyncThunk(
  'venta/completarPedido',
  async ( id, { rejectWithValue }) => {
    try {
      const data = await completarPedidoApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const obtenerVentas = createAsyncThunk(
  'venta/obtenerVentas',
  async (_, { rejectWithValue }) => {
    try {
      const data = await obtenerVentasApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const obtenerVentaPorId = createAsyncThunk(
  'venta/obtenerVentaPorId',
  async (id, { rejectWithValue }) => {
    try {
      const data = await obtenerVentaPorIdApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const obtenerVentaPorSesionDeCaja = createAsyncThunk(
  'venta/obtenerVentaPorSesionDeCaja',
  async (id, { rejectWithValue }) => {
    try {
      const data = await obtenerVentaPorSesionDeCajaApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ventaSlice = createSlice({
  name: 'venta',
  initialState: {
    ventas: [],   
    ultimaVenta: null, 
    detalleVenta: null,
    error: null,    
    loading: false,  
  },
  reducers: {
    limpiarError: (state) => {
      state.error = null; 
    },
    limpiarUltimaVenta: (state) => {
      state.ultimaVenta = null; 
    },
    limpiarDetalleVenta: (state) => {
      state.detalleVenta = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerVentas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerVentas.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = action.payload;
      })
      .addCase(obtenerVentas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(obtenerVentaPorSesionDeCaja.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerVentaPorSesionDeCaja.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = action.payload;
      })
      .addCase(obtenerVentaPorSesionDeCaja.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(obtenerVentaPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerVentaPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.detalleVenta = action.payload;
      })
      .addCase(obtenerVentaPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(realizarVenta.pending, (state) => {
        state.loading = true;   
        state.error = null;     
        state.ultimaVenta = null; 
      })
      .addCase(realizarVenta.fulfilled, (state, action) => {
        state.loading = false; 
        state.ventas.push(action.payload); 
        state.ultimaVenta = action.payload; 
        state.error = null;
      })
      .addCase(realizarVenta.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload || 'Error al realizar el pedido'; 
      })

      .addCase(realizarPedido.pending, (state) => {
        state.loading = true;   
        state.error = null;     
        state.ultimaVenta = null; 
      })
      .addCase(realizarPedido.fulfilled, (state, action) => {
        state.loading = false; 
        state.ventas.push(action.payload); 
        state.ultimaVenta = action.payload; 
        state.error = null;
      })
      .addCase(realizarPedido.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload || 'Error al realizar el pedido'; 
      })

      .addCase(actualizarPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = state.ventas.map((venta) =>
          venta.id === action.payload.id ? action.payload : venta
        );
        state.ultimaVenta = action.payload;
      })
      .addCase(actualizarPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(pagarPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pagarPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = state.ventas.map((venta) =>
          venta.id === action.payload.id ? action.payload : venta
        );
      })
      .addCase(pagarPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(cancelarPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelarPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = state.ventas.map((venta) =>
          venta.id === action.payload.id ? action.payload : venta
        );
      })
      .addCase(cancelarPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(completarPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completarPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = state.ventas.map((venta) =>
          venta.id === action.payload.id ? action.payload : venta
        );
      })
      .addCase(completarPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { limpiarError, limpiarUltimaVenta, limpiarDetalleVenta  } = ventaSlice.actions;
export default ventaSlice.reducer;
