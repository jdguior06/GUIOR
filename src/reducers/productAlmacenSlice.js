import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchProductosAlmacenApi,
    fetchProductoAlmacenApi,
    ajustarStockApi,
} from '../services/productAlmacenService';

export const fetchProductosAlmacen = createAsyncThunk(
    'productoAlmacen/fetchProductosAlmacen',
    async (idAlmacen, { rejectWithValue }) => {
        try {
            const data = await fetchProductosAlmacenApi(idAlmacen);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProductoAlmacen = createAsyncThunk(
    'productoAlmacen/fetchProductoAlmacen',
    async (id, { rejectWithValue }) => {
        try {
            const data = await fetchProductoAlmacenApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const ajustarStock = createAsyncThunk(
    'productoAlmacen/ajustarStock',
    async ({id, cantidad}, { rejectWithValue}) => {
        try {
            const data = await ajustarStockApi(id, cantidad);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const productoAlmacenSlice = createSlice({
    name: 'productoAlmacenes',
    initialState: {
        productosAlmacen: [],
        productoAlmacen: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductosAlmacen.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductosAlmacen.fulfilled, (state, action) => {
                state.loading = false;
                state.productosAlmacen = action.payload;
            })
            .addCase(fetchProductosAlmacen.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(ajustarStock.pending, (state) => {
                state.loading = true;
            })
            .addCase(ajustarStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ajustarStock.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.productosAlmacen.findIndex(productoAlmacen => productoAlmacen.id === action.payload.id);
                if (index !== -1) {
                    state.productosAlmacen[index] = action.payload;
                }
            });
    },
});

export default productoAlmacenSlice.reducer;
