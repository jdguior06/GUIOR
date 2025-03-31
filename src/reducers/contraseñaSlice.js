import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cambiarContrseña } from "../services/contraseñaService";

export const actualizarContraseñaTrunk = createAsyncThunk(
    "usuario/actualizarContraseña", async (data, { rejectWithValue }) => {
        try {
            const respon = await cambiarContrseña(data);
            return respon;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const contraseñaSlice = createSlice({
    name: "contraseña",
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetEstado: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(actualizarContraseñaTrunk.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(actualizarContraseñaTrunk.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(actualizarContraseñaTrunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { resetEstado } = contraseñaSlice.actions;
export default contraseñaSlice.reducer;