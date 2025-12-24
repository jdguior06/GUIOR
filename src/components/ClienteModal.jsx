import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ClienteModal = ({ open, onClose, selectedClient, onSave, isEditing }) => {
  // Estado local para los datos del cliente (nombre, apellido, email, nit)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    nit: "",
  });

  // Cada vez que el modal se abre y tiene un cliente seleccionado, cargamos los datos de ese cliente en el estado
  useEffect(() => {
    if (isEditing && selectedClient) {
      setFormData({
        nombre: selectedClient.nombre || "",
        apellido: selectedClient.apellido || "",
        email: selectedClient.email || "",
        nit: selectedClient.nit || "",
      });
    } else {
      // Si no estamos editando, limpiamos el formulario
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        nit: "",
      });
    }
  }, [isEditing, selectedClient, open]);

  // Manejador para actualizar el estado del formulario en cada cambio de input
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envío del formulario
  const onSubmit = (e) => {
    e.preventDefault();
    // Llamamos a la función `onSave` pasándole los datos del cliente, y cerramos el modal
    onSave({ ...formData, id: selectedClient?.id });  // Incluimos el `id` si estamos en modo edición
  };

  if (!open) return null;  // Si el modal no está abierto, no renderizamos nada

  return (
    <div className="overlay fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="modalContainer bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h3 className="text-2xl mb-4">
          {isEditing ? "Editar Cliente" : "Crear Cliente"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={onChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Apellido"
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Correo Electrónico"
              // required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NIT
            </label>
            <input
              type="text"
              name="nit"
              value={formData.nit}
              onChange={onChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Número de Identificación Tributaria"
              // required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}  // Cierra el modal al hacer clic en "Cancelar"
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ClienteModal.propTypes = {
  open: PropTypes.bool.isRequired,  
  onClose: PropTypes.func.isRequired, 
  selectedClient: PropTypes.object,  
  onSave: PropTypes.func.isRequired,  
  isEditing: PropTypes.bool.isRequired,  
};

export default ClienteModal;
