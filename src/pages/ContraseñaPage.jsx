import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../utils/toast";
import { actualizarContraseñaTrunk } from "../reducers/contraseñaSlice";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContraseñaPage = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contraseña);

  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevaContraseña !== confirmarContraseña) {
      showNotification.warning("Las contraseñas nuevas no coinciden");
      return;
    }
    dispatch(
      actualizarContraseñaTrunk({
        contraseñaActual,
        nuevaContraseña,
        confirmarContraseña,
      })
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Cambiar Contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Contraseña actual</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={contraseñaActual}
                onChange={(e) => setContraseñaActual(e.target.value)}
                required
                className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Nueva contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={nuevaContraseña}
                onChange={(e) => setNuevaContraseña(e.target.value)}
                required
                className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmarContraseña}
                onChange={(e) => setConfirmarContraseña(e.target.value)}
                required
                className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500">
            La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula,
            un número y un símbolo especial.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
            <CheckCircle className="mr-2" size={20} />
            <p>Contraseña actualizada con éxito</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContraseñaPage;
