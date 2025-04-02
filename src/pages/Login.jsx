import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../services/authServices";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(login(email, password));

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Redirigir al dashboard si el usuario ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-800">Iniciar Sesión</h1>
        <p className="mb-8 text-gray-600 text-center">
          Maneja tu restaurante como un profesional en el mercado
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-700">
              Correo Electrónico
            </label>
            <div className="flex items-center border-b-2 border-gray-300 py-2 focus-within:border-blue-500 transition duration-300">
              <EnvelopeIcon className="h-6 w-6 text-blue-500" />
              <input
                className="w-full py-2 text-gray-700 focus:outline-none focus:ring-0 ml-2"
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Ingresa tu dirección de correo"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Contraseña
            </label>
            <div className="flex items-center border-b-2 border-gray-300 py-2 focus-within:border-blue-500 transition duration-300">
              <LockClosedIcon className="h-6 w-6 text-blue-500" />
              <input
                className="w-full py-2 text-gray-700 focus:outline-none focus:ring-0 ml-2"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Link de registro */}
        <div className="mt-6 text-center">
          <label
            onClick={() => navigate("/registro")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            ¿No tienes cuenta? Regístrate aquí
          </label>
        </div>
      </div>
    </div>
  );
};

export default Login;
