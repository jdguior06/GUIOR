import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
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
import cartReducer from './reducers/cartSlice';
import ventaReducer from './reducers/ventaSlice';
import reporteSlice from './reducers/reporteSlice';
import reportesSlice from './reducers/reportesSlices';
import contraseñaSlice from './reducers/contraseñaSlice';
import { setAuthInterceptor } from './utils/api';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';

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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cajaSesion'], // Sólo queremos persistir cajaSesion
};

const rootReducer = combineReducers({
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
  usuarios: usuarioReducer,
  productoAlmacenes: productoAlmacenReducer,
  notasEntrada: notaEntradaReducer,
  cajaSesion: cajaSesionReducer,
  cart: cartReducer,
  venta: ventaReducer,
  reporte: reporteSlice,
  reportes: reportesSlice,
  contraseña: contraseñaSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     clientes: clienteReducer,
//     proveedores: proveedorReducer,
//     productos: productoReducer,
//     categorias: categoriaReducer,
//     sucursales: sucursalReducer,
//     almacenes: almacenReducer,
//     cajas: cajaReducer,
//     permisos: permisoReducer,
//     roles: rolReducer,
//     usuarios : usuarioReducer,
//     productoAlmacenes: productoAlmacenReducer,
//     notasEntrada: notaEntradaReducer,
//     cajaSesion: cajaSesionReducer,
//     cart: cartReducer,
//     venta: ventaReducer,
//     reporte: reporteSlice,
//     reportes: reportesSlice,
//     contraseña: contraseñaSlice
//   },
//   preloadedState,
// });

setAuthInterceptor(store); 