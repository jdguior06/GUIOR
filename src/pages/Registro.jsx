import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from "../services/registrosuscriptorServices";  // Importar el servicio con el nuevo nombre

const Registro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    plan: location.state?.plan || "Free mes"
  });

  const { nombre, apellido, email, password, plan } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Llamada al servicio de registro
    const response = await registerUser(
      { nombre, apellido, email, password },  // usuarioDTO
      { nombre: plan }                        // planDTO
    );

    if (response.success) {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-800">Registrarse</h1>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm text-gray-700">Nombre</label>
            <input
              className="w-full py-2 px-3 border border-gray-300 rounded-lg"
              type="text"
              name="nombre"
              value={nombre}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-700">Apellido</label>
            <input
              className="w-full py-2 px-3 border border-gray-300 rounded-lg"
              type="text"
              name="apellido"
              value={apellido}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-700">Correo Electrónico</label>
            <input
              className="w-full py-2 px-3 border border-gray-300 rounded-lg"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-700">Contraseña</label>
            <input
              className="w-full py-2 px-3 border border-gray-300 rounded-lg"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition duration-300"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
