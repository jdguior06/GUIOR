import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlanes } from "../services/planServices";

const CatalogoPlanes = () => {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("mes");

  useEffect(() => {
    const obtenerPlanes = async () => {
      try {
        const data = await fetchPlanes();
        setPlanes(data);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPlanes();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Cargando planes...</p>;
  }

  const filteredPlanes = planes.filter((plan) => plan.tipo === selectedType);

  const togglePlanType = () => {
    setSelectedType((prevType) => (prevType === "mes" ? "año" : "mes"));
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-gray-300">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-100">Planes de Suscripción</h2>
      
      <div className="flex justify-center items-center mb-6 space-x-2">
        <span className={`${selectedType === "año" ? "text-gray-100 font-semibold" : "text-gray-400"}`}>Anual</span>
        <div
          className="relative inline-flex items-center cursor-pointer"
          onClick={togglePlanType}
        >
          <span
            className={`w-10 h-6 bg-gray-700 rounded-full shadow-inner transition-colors duration-300 ${
              selectedType === "mes" ? "bg-blue-500" : ""
            }`}
          ></span>
          <span
            className={`absolute left-1 top-1 w-4 h-4 bg-gray-200 rounded-full shadow transition-transform duration-300 ${
              selectedType === "mes" ? "translate-x-4" : ""
            }`}
          ></span>
        </div>
        <span className={`${selectedType === "mes" ? "text-gray-100 font-semibold" : "text-gray-400"}`}>Mensual</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlanes.map((plan) => (
          <div key={plan.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-100">{plan.nombre}</h3>
            <p className="text-gray-400">{plan.descripcion}</p>
            <p className="text-gray-300 mt-2">Costo: ${plan.costo}</p>
            <p className="text-gray-300">Usuarios permitidos: {plan.limite_usuarios}</p>
            <p className="text-gray-300">Sucursales permitidas: {plan.limite_sucursales}</p>
            
            {/* Botón para seleccionar el plan y redirigir a registro */}
            <button
              onClick={() => navigate("/registro", { state: { plan: plan.nombre } })}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Seleccionar este plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoPlanes;
