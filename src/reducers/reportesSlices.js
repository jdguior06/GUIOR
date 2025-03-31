import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReporteProductosPorFechaApi } from "../services/reporteServices";

export const fetchReporteProductosPorFecha = createAsyncThunk(
  "reportes/fetchReporteProductosPorFecha",
  async ({ inicioFecha, finFecha }, { rejectWithValue }) => {
    try {
      return await fetchReporteProductosPorFechaApi(inicioFecha, finFecha);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reportesSlice = createSlice({
  name: "reportes",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReporteProductosPorFecha.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReporteProductosPorFecha.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReporteProductosPorFecha.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reportesSlice.reducer;
