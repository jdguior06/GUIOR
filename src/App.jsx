import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import PlanPage from "./pages/CatalogoPlanes";
import ProductosPage from "./pages/ProductosPage";
import CategoriasPage from "./pages/CategoriasPage";
import ClientesPage from "./pages/ClientesPage";
import ProveedoresPage from "./pages/ProveedoresPage";
import SucursalesPage from "./pages/SucursalesPage";
import SucursalPanel from "./pages/SucursalPanel";
import AlmacenesPage from "./pages/AlmacenesPage";
import CajasPage from "./pages/CajasPage";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ConfiguracionForm from "./pages/ConfiguracionForm";
import BackupForm from "./pages/BackupForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./layouts/Dashboard";
import Navbar1 from "./components/Navbar1";
import { useDispatch } from "react-redux";
import { clearAuth } from "./reducers/authSlice";
import PermisosPage from "./pages/PermisosPage";
import RolesPage from "./pages/RolesPage";
import UsuariosPage from "./pages/UsuariosPage";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSettings from "./pages/ThemeSettings";
import api from "./utils/api";
import InventarioPage from "./pages/InventarioPage";
import NotasEntradaPage from "./pages/NotasEntradaPage";
import ReportePage from "./pages/ReportePage";
import PosPage from "./pages/PosPage";
import VentasPage from "./pages/VentasPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import CajaSesionPage from "./pages/CajaSesionPage";

function App() {
  const dispatch = useDispatch();
  const [selectedSucursal, setSelectedSucursal] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (authData?.token) {
        try {
          const response = await api.get("/auth/me");
          // console.log(response.data)
          if (!response.data) {
            dispatch(clearAuth());
          }
        } catch (error) {
          dispatch(clearAuth()); 
        }
      } else {
        dispatch(clearAuth());
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const NavbarLayout = () => (
    <>
      <Navbar1 />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );

  return (
    <ThemeProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          {/* Rutas donde se muestra Navbar1 */}
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/planes" element={<PlanPage />} />
            <Route path="/registro" element={<Registro />} />
          </Route>

          {/* Otras rutas protegidas con el Navbar diferente o sin Navbar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Dashboard selectedSucursal={selectedSucursal} />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/proveedores" element={<ProveedoresPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/reportes" element={<ReportePage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/permisos" element={<PermisosPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/ventas" element={<VentasPage />} />
              <Route path="/caja-sesion" element={<CajaSesionPage />} />
              <Route path="/temas" element={<ThemeSettings />} />
              <Route
                path="/sucursales"
                element={
                  <SucursalesPage setSelectedSucursal={setSelectedSucursal} />
                }
              />
              <Route
                path="/sucursales/:id/panel"
                element={<SucursalPanel selectedSucursal={selectedSucursal} />}
              >
                <Route index element={<Navigate to="almacenes" replace />} />
                <Route path="almacenes" element={<AlmacenesPage />} />
                <Route path="cajas" element={<CajasPage />} />
                <Route
                  path="/sucursales/:id/panel/almacenes/:idAlmacen"
                  element={<InventarioPage />}
                />
                <Route
                  path="/sucursales/:id/panel/almacenes/:idAlmacen/notas-entrada"
                  element={<NotasEntradaPage />}
                />
              </Route>
              {/* Ruta directa para configuración y backup */}
              <Route path="/settings" element={<ConfiguracionForm />} />
              <Route path="/backup" element={<BackupForm />} />
            </Route>
            {/* <Route path="cajas/:cajaId/sesion" element={<PosPage />} /> */}
            <Route
              path="cajas/:cajaId/sesion/:sesionId"
              element={<PosPage />}
            />
          </Route>
          {/* Ruta para cualquier otro acceso a rutas inválidas */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
