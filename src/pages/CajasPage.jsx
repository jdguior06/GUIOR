import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCajas,
  addCaja,
  updateCaja,
  deleteCaja,
  activarCaja,
} from "../reducers/cajaSlice";
import CajaModal from "../components/CajaModal";
import AperturaCajaModal from "../components/AperturaCajaModal";
import {
  PencilSquareIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import { verificarSesionAbierta } from "../reducers/cajaSesionSlice";
import ThemedButton from "../components/ThemedButton";
import { showNotification } from "../utils/toast";
import PermissionWrapper from "../components/PermissionWrapper";

const CajasPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();

  const { cajas = [], loading, error } = useSelector((state) => state.cajas);

  const [openModal, setOpenModal] = useState(false);
  const [openAperturaModal, setOpenAperturaModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchCajas(id));
  }, [dispatch, id]);

  const handleOpenModal = (caja = null) => {
    setSelectedCaja(caja);
    setIsEditing(!!caja);
    setOpenModal(true);
  };

  const handleSave = async (caja) => {
    if (isEditing) {
      await dispatch(updateCaja({ idSucursal: id, idCaja: caja.id, caja }));
    } else {
      await dispatch(addCaja({ idSucursal: id, caja }));
    }
    setOpenModal(false);
    dispatch(fetchCajas(id));
  };

  const handleDelete = async (idCaja) => {
    const caja = cajas.find((c) => c.id === idCaja);
    if (caja.activo) {
      await dispatch(deleteCaja({ idSucursal: id, idCaja }));
    } else {
      await dispatch(activarCaja({ idSucursal: id, idCaja }));
    }
    dispatch(fetchCajas(id));
  };

  const handleOpenAperturaModal = async (caja) => {
    try {
      const { mismaSesion, sesion } = await dispatch(
        verificarSesionAbierta(caja.id)
      ).unwrap();

      if (sesion) {
        if (mismaSesion) {
          showNotification.info(
            "Sesión abierta encontrada. Redirigiendo a la sesión actual..."
          );
          navigate(`/cajas/${caja.id}/sesion/${sesion.id}`, {
            state: { idSucursal: id },
          });
        } else {
          showNotification.error(
            "La caja tiene una sesión abierta, pero pertenece a otro usuario."
          );
        }
      } else {
        setSelectedCaja(caja);
        setOpenAperturaModal(true);
      }
    } catch (error) {
      showNotification.error(error.message || "Error al verificar la sesión.");
    }
  };

  // Filtrar cajas
  const filteredCajas = (cajas || []).filter(
    (caja) =>
      (showInactive || caja.activo) &&
      caja.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ color: theme.textColor }}>Cargando...</div>;
  if (error)
    return <div style={{ color: theme.textColor }}>Error: {error}</div>;

  return (
    <>
      <CajaModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedCaja={selectedCaja}
        onSave={handleSave}
        isEditing={isEditing}
      />

      {/* Modal para la apertura de caja */}
      <AperturaCajaModal
        open={openAperturaModal}
        onClose={() => setOpenAperturaModal(false)}
        selectedCaja={selectedCaja}
        idSucursal={id}
      />

      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Gestión de Cajas
        </h2>

        {/* Barra de búsqueda y opciones de visualización */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar caja"
            className="border rounded-lg py-2 px-4 w-1/2 shadow-sm focus:outline-none focus:ring-2 transition"
            style={{
              color: theme.textColor,
              backgroundColor: theme.backgroundColor,
              borderColor: theme.primaryColor,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PermissionWrapper permission="PERMISO_ADMINISTRAR_SUCURSALES">
            <ThemedButton variant="primary" onClick={() => handleOpenModal()}>
              Crear Caja
            </ThemedButton>
          </PermissionWrapper>

          <div className="flex items-center ml-4">
          <PermissionWrapper permission="PERMISO_ADMINISTRAR_SUCURSALES">
            <input
              type="checkbox"
              id="showInactive"
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
            <label htmlFor="showInactive" style={{ color: theme.textColor }}>
              Mostrar inactivos
            </label>
            </PermissionWrapper>
          </div>
        </div>

        {/* Grid de cajas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCajas.map((caja) => (
            <div
              key={caja.id}
              className={`p-4 rounded-lg shadow-lg transition ${
                caja.activo ? "bg-white" : "bg-gray-300"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">Caja {caja.nombre}</h3>
              <p className="text-sm">
                <strong> ID: </strong>
                {caja.id}
              </p>
              <p className="text-sm">
                {" "}
                <strong>Sucursal: </strong> {caja.sucursal?.nombre || "N/A"}
              </p>

              {/* Acciones */}
              <div className="flex justify-between mt-4">
              <PermissionWrapper permission="PERMISO_ADMINISTRAR_SUCURSALES">
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-3 rounded-lg shadow-sm flex items-center transition transform hover:scale-105"
                  onClick={() => handleOpenModal(caja)}
                >
                  <PencilSquareIcon className="h-5 w-5 mr-1 inline" />
                </button>
                <button
                  className={`${
                    caja.activo
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } py-1 text-white px-3 rounded-lg shadow transform transition hover:scale-105`}
                  onClick={() => handleDelete(caja.id)}
                >
                  {caja.activo ? (
                    <TrashIcon className="h-5 w-5 mr-1" />
                  ) : (
                    <ArrowPathIcon className="h-5 w-5 mr-1" />
                  )}
                </button>
                </PermissionWrapper>
                
                <button
                  className="text-white py-1 px-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow-sm flex items-center transition transform hover:scale-105"
                  onClick={() => handleOpenAperturaModal(caja)}
                >
                  <CurrencyDollarIcon className="h-5 w-5 mr-1 inline" />
                  Aperturar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CajasPage;
