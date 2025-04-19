import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { aperturaCaja } from "../reducers/cajaSesionSlice";
import { showNotification } from "../utils/toast";

const AperturaCajaModal = ({ open, onClose, selectedCaja, idSucursal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [monto, setMonto] = useState("");
  const { loading, error } = useSelector((state) => state.cajaSesion);
  const userEmail = useSelector((state) => state.auth.user?.email);

  const [horaActual, setHoraActual] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraActual(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleApertura = () => {
    if (selectedCaja) {
      const montoInicial = monto === "" ? 0.0 : parseFloat(monto);
      dispatch(aperturaCaja({ id_caja: selectedCaja.id, monto: montoInicial }))
        .then((action) => {
          if (aperturaCaja.fulfilled.match(action)) {
            if (action.payload.conflict) {
              showNotification.info(
                "Ya existe una sesión abierta para esta caja. Redirigiendo a la sesión actual..."
              );
              navigate(
                `/cajas/sesion/${action.payload.sesionAbiertaId}`,
                { state: { idSucursal } }
              );
            } else {
              onClose();
              navigate(
                `/cajas/sesion/${action.payload.sesion.id}`,
                { state: { idSucursal } }
              );
            }
          }
        })
        .catch((error) => {
          showNotification.error("Error al abrir la caja: " + error.message);
        });
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
          <h2 className="text-xl font-bold mb-4">
            Apertura de Caja - {selectedCaja?.nombre}
          </h2>

          {/* Mostrar usuario */}
          <div className="mb-4">
            <span className="block text-sm font-medium text-gray-600">
              Usuario:
            </span>
            <span className="block text-lg font-semibold text-gray-800">
              {userEmail || "Usuario"}
            </span>
          </div>

          {/* Mostrar hora actual */}
          <div className="mb-4">
            <span className="block text-sm font-medium text-gray-600">
              Hora actual:
            </span>
            <span className="block text-lg font-semibold text-gray-800">
              {horaActual}
            </span>
          </div>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Monto inicial"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="border rounded px-4 py-2 mt-2 mb-4 w-full"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleApertura}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Aperturando..." : "Aperturar"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AperturaCajaModal;
