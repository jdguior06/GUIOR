import { useState } from "react";
import {
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "../reducers/authSlice";
import PermissionWrapper from "./PermissionWrapper";
import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ isOpen, toggleSidebar, selectedSucursal }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAlmacenesOpen, setIsAlmacenesOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
  };

  const isInsideAlmacen =
    selectedSucursal &&
    location.pathname.includes(
      `/sucursales/${selectedSucursal.id}/panel/almacenes`
    ) &&
    location.pathname.split("/").length >= 6;

  return (
    <div
      className={`flex flex-col text-white w-64 py-6 px-3 absolute inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 transition duration-300 ease-in-out shadow-lg border-r border-gray-700`}
      style={{ backgroundColor: theme.primaryColor }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 lg:hidden"
      >
        <XMarkIcon className="w-6 h-6 text-white" />
      </button>
      <nav className="space-y-1 flex-1">
        {!selectedSucursal ? (
          <>
            <Link
              to="/sucursales"
              className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                location.pathname === "/sucursales" ? "bg-red-700" : ""
              }`}
            >
              <HomeIcon className="w-5 h-5 mr-2" /> Todas las Sucursales
            </Link>
            <PermissionWrapper permission={"PERMISO_VER_REPORTE_VENTAS"}>
              <Link
                to="/ventas"
                className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                  location.pathname === "/ventas" ? "bg-red-700" : ""
                }`}
              >
                <ShoppingCartIcon className="w-5 h-5 mr-2" /> Ventas
              </Link>
              <Link
                to="/caja-sesion"
                className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                  location.pathname === "/caja-sesion" ? "bg-red-700" : ""
                }`}
              >
                <ShoppingCartIcon className="w-5 h-5 mr-2" /> Sesiones de caja
              </Link>
            </PermissionWrapper>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold bg-yellow-500 text-gray-900 rounded-lg py-1.5">
                {selectedSucursal.nombre}
              </h2>
            </div>

            <div>
              <PermissionWrapper permission="PERMISO_VER_ALMACENES">
                <button
                  className="w-full flex items-center text-left py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600"
                  onClick={() => setIsAlmacenesOpen(!isAlmacenesOpen)}
                >
                  <CubeIcon className="w-5 h-5 mr-2" /> Almacenes
                  {isAlmacenesOpen ? (
                    <ChevronUpIcon className="w-5 h-5 ml-auto" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ml-auto" />
                  )}
                </button>
                {isAlmacenesOpen && (
                  <div className="pl-6 space-y-1">
                    <Link
                      to={`/sucursales/${selectedSucursal.id}/panel/almacenes`}
                      className={`block py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                        location.pathname.includes("/panel/almacenes") &&
                        !location.pathname.includes("/notas-entrada")
                          ? "bg-red-700"
                          : ""
                      }`}
                    >
                      Gestionar Almacenes
                    </Link>
                    {isInsideAlmacen && (
                      <Link
                        to={`/sucursales/${
                          selectedSucursal.id
                        }/panel/almacenes/${
                          location.pathname.split("/")[5]
                        }/notas-entrada`}
                        className={`block py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                          location.pathname.includes("/notas-entrada")
                            ? "bg-red-700"
                            : ""
                        }`}
                      >
                        Notas de compras
                      </Link>
                    )}
                  </div>
                )}
              </PermissionWrapper>
            </div>

            <Link
              to={`/sucursales/${selectedSucursal.id}/panel/cajas`}
              className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                location.pathname.includes("/cajas") ? "bg-red-700" : ""
              }`}
            >
              <TruckIcon className="w-5 h-5 mr-2" /> Cajas
            </Link>
            {/* <Link
              to={`/reportes`}
              className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                location.pathname.includes("/reportes") ? "bg-red-700" : ""
              }`}
            >
              <ChartBarIcon className="w-5 h-5 mr-2" /> Reportes
            </Link> */}
          </>
        )}
        {/* Resto de las opciones de navegación */}
        <PermissionWrapper permission="PERMISO_GESTIONAR_PERSONAL">
          <Link
            to="/usuarios"
            className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
              location.pathname.includes("/usuarios") ? "bg-red-700" : ""
            }`}
          >
            <UsersIcon className="w-5 h-5 mr-2" /> Personal
          </Link>
        </PermissionWrapper>

        <div>
          <PermissionWrapper permission={"PERMISO_VER_PRODUCTOS"}>
            <button
              className="w-full flex items-center text-left py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600"
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              <CubeIcon className="w-5 h-5 mr-2" /> Productos
              {isProductsOpen ? (
                <ChevronUpIcon className="w-5 h-5 ml-auto" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 ml-auto" />
              )}
            </button>
            {isProductsOpen && (
              <div className="pl-6 space-y-1">
                <Link
                  to="/productos"
                  className={`block py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                    location.pathname === "/productos" ? "bg-red-700" : ""
                  }`}
                >
                  Productos
                </Link>

                <PermissionWrapper permission={"PERMISO_VER_CATEGORIAS"}>
                  <Link
                    to="/categorias"
                    className={`block py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
                      location.pathname === "/categorias" ? "bg-red-700" : ""
                    }`}
                  >
                    Categorías
                  </Link>
                </PermissionWrapper>
              </div>
            )}
          </PermissionWrapper>
        </div>

        {/* Más opciones de navegación */}
        <PermissionWrapper permission={"PERMISO_VER_CLIENTES"}>
          <Link
            to="/clientes"
            className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
              location.pathname.includes("/clientes") ? "bg-red-700" : ""
            }`}
          >
            <UserIcon className="w-5 h-5 mr-2" /> Clientes
          </Link>
        </PermissionWrapper>

        <PermissionWrapper permission="PERMISO_GESTIONAR_PROVEEDORES">
          <Link
            to="/proveedores"
            className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
              location.pathname.includes("/proveedores") ? "bg-red-700" : ""
            }`}
          >
            <TruckIcon className="w-5 h-5 mr-2" /> Proveedores
          </Link>
        </PermissionWrapper>

        <PermissionWrapper permission="PERMISO_GESTIONAR_ROLES">
          <Link
            to="/roles"
            className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
              location.pathname.includes("/roles") ? "bg-red-700" : ""
            }`}
          >
            <UserGroupIcon className="w-5 h-5 mr-2" /> Roles
          </Link>
        </PermissionWrapper>
        <PermissionWrapper permission="PERMISO_GESTIONAR_PERMISOS">
          <Link
            to="/permisos"
            className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
              location.pathname.includes("/permisos") ? "bg-red-700" : ""
            }`}
          >
            <ShieldCheckIcon className="w-5 h-5 mr-2" /> Permisos
          </Link>
        </PermissionWrapper>

        {/* <Link
          to="/settings"
          className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
            location.pathname.includes("/settings") ? "bg-red-700" : ""
          }`}
        >
          <CogIcon className="w-5 h-5 mr-2" /> Configuración
        </Link>

        <Link
          to="/temas"
          className={`flex items-center py-2 px-3 rounded-lg transition duration-200 hover:bg-red-600 ${
            location.pathname.includes("/temas") ? "bg-red-700" : ""
          }`}
        >
          <CogIcon className="w-5 h-5 mr-2" /> Temas
        </Link> */}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center w-full py-2 px-3 mt-auto rounded-lg transition duration-200 hover:bg-red-600"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" /> Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;
