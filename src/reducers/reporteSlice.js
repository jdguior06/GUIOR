import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProductosVendidosApi } from "../services/reporteServices";

export const fetchProductosVendidos = createAsyncThunk('caja-sesion/fetchProductosVendidos', async (id, { rejectWithValue }) => {
    try {
        const data = await fetchProductosVendidosApi(id);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const reporteSlice = createSlice({
    name: 'reporte',
    initialState: {
        productosVendidos: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductosVendidos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductosVendidos.fulfilled, (state, action) => {
                state.loading = false;
                state.productosVendidos = action.payload;
            })
            .addCase(fetchProductosVendidos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default reporteSlice.reducer;
