import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchProductosApi,
  fetchProductoApi,
  addProductoApi,
  updateProductoApi,
  fetchProductosConsolidadosApi,
  desactivarProductoApi,
  activarProductoApi,
  fetchProductosActivosApi,
} from '../services/productoServices';  // Importamos los servicios API

// Thunks para las acciones asíncronas
export const fetchProductos = createAsyncThunk('productos/fetchProductos', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchProductosApi();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchProductosActivos = createAsyncThunk('productos/fetchProductosActivos', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchProductosActivosApi();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchProducto = createAsyncThunk('productos/fetchProducto', async (id, { rejectWithValue }) => {
  try {
    const data = await fetchProductoApi(id);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addProducto = createAsyncThunk('productos/addProducto', async (producto, { rejectWithValue }) => {
  try {
    const data = await addProductoApi(producto);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateProducto = createAsyncThunk('productos/updateProducto', async ({ id, producto }, { rejectWithValue }) => {
  try {
    const data = await updateProductoApi(id, producto);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteProducto = createAsyncThunk('productos/desactivarProducto', async (id, { rejectWithValue }) => {
  try {
    await desactivarProductoApi(id);
    return { id };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const activarProducto = createAsyncThunk('productos/activarProducto', async (id, { rejectWithValue }) => {
  try {
    await activarProductoApi(id);
    return { id };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchProductosConsolidados = createAsyncThunk(
  'productos/fetchConsolidados',
  async (idSucursal, { rejectWithValue }) => {
    try {
      const data = await fetchProductosConsolidadosApi(idSucursal);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice de productos
const productoSlice = createSlice({
  name: 'productos',
  initialState: {
    productos: [],
    producto: null,
    productosConsolidados: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch productos
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductosActivos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductosActivos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchProductosActivos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch producto
      .addCase(fetchProducto.fulfilled, (state, action) => {
        state.producto = action.payload;
        state.loading = false;
      })

      // Add producto
      .addCase(addProducto.fulfilled, (state, action) => {
        state.productos.push(action.payload);
      })

      // Update producto
      .addCase(updateProducto.fulfilled, (state, action) => {
        const index = state.productos.findIndex(producto => producto.id === action.payload.id);
        if (index !== -1) {
          state.productos[index] = action.payload;
        }
      })

      // Delete producto
      .addCase(deleteProducto.fulfilled, (state, action) => {
        state.productos = state.productos.filter(producto => producto.id !== action.payload.id);
      })

      .addCase(deleteProducto.rejected, (state, action) => {
        state.error = action.payload;
      })

      // activar producto
      .addCase(activarProducto.fulfilled, (state, action) => {
        state.productos = state.productos.filter(producto => producto.id !== action.payload.id);
      })

      .addCase(activarProducto.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch productos consolidados
      .addCase(fetchProductosConsolidados.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductosConsolidados.fulfilled, (state, action) => {
        state.loading = false;
        state.productosConsolidados = action.payload; // Asigna los productos consolidados
      })
      .addCase(fetchProductosConsolidados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productoSlice.reducer;
