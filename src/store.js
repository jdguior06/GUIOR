import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import clienteReducer from './reducers/clienteSlice';
import proveedorReducer from './reducers/proveedorSlice';
import productoReducer from './reducers/productoSlice';
import categoriaReducer from './reducers/categoriaSlice';
import sucursalReducer from './reducers/sucursalSlice';
import almacenReducer from './reducers/almacenSlice';
import cajaReducer from './reducers/cajaSlice';
import permisoReducer from './reducers/permisoSlice';
import rolReducer from './reducers/rolSlice';
import usuarioReducer from './reducers/usuarioSlice';
import productoAlmacenReducer from './reducers/productAlmacenSlice';
import notaEntradaReducer from './reducers/notaEntradaSlice';
import cajaSesionReducer from './reducers/cajaSesionSlice';
import cartReducer from './reducers/cartSlice'
import ventaReducer from './reducers/ventaSlice'
import reporteSlice from './reducers/reporteSlice'
import { setAuthInterceptor } from './utils/api';

const authData = JSON.parse(localStorage.getItem('auth'));

const preloadedState = {
  auth: {
    token: authData?.token || null,
    isAuthenticated: !!authData?.token,
    user: authData?.user || null,
    permisos: authData?.permisos || [],
    loading: false,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clientes: clienteReducer,
    proveedores: proveedorReducer,
    productos: productoReducer,
    categorias: categoriaReducer,
    sucursales: sucursalReducer,
    almacenes: almacenReducer,
    cajas: cajaReducer,
    permisos: permisoReducer,
    roles: rolReducer,
    usuarios : usuarioReducer,
    productoAlmacenes: productoAlmacenReducer,
    notasEntrada: notaEntradaReducer,
    cajaSesion: cajaSesionReducer,
    cart: cartReducer,
    venta: ventaReducer,
    reporte: reporteSlice,
  },
  preloadedState,
});

setAuthInterceptor(store); 