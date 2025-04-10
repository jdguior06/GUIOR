import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientes,
  addCliente,
  updateCliente,
  deleteCliente,
  activarCliente,
} from "../reducers/clienteSlice";
import ClienteModal from "../components/ClienteModal";
import ClienteDeleteModal from "../components/ClienteDeleteModal";
import { useTheme } from "../context/ThemeContext"; // Importa useTheme para usar los colores del tema
import ThemedButton from "../components/ThemedButton";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import PermissionWrapper from "../components/PermissionWrapper";

const ClientesPage = () => {
  const dispatch = useDispatch();
  const { clientes, loading, error } = useSelector((state) => state.clientes);
  const { theme } = useTheme(); // Extrae el tema actual

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const handleOpenModal = (client = null) => {
    setSelectedClient(client);
    setIsEditing(!!client);
    setOpenModal(true);
  };

  const handleOpenDeleteModal = (client) => {
    setSelectedClient(client);
    setOpenDeleteModal(true);
  };

  const handleDelete = async (id) => {
    const cliente = clientes.find((c) => c.id === id);
    if (cliente.activo) {
      await dispatch(deleteCliente(id));
    } else {
      await dispatch(activarCliente(id));
    }
    setOpenDeleteModal(false);
    dispatch(fetchClientes());
  };

  const handleSave = async (cliente) => {
    if (isEditing) {
      await dispatch(updateCliente(cliente));
    } else {
      await dispatch(addCliente(cliente));
    }
    setOpenModal(false);
    dispatch(fetchClientes());
  };

  const filteredClientes = clientes.filter(
    (cliente) =>
      (showInactive || cliente.activo) &&
      (`${cliente.nombre} ${cliente.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.nit.toString().includes(searchTerm))
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClientes = filteredClientes.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center text-xl">Cargando...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      {/* Modal para crear o editar cliente */}
      <ClienteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedClient={selectedClient}
        onSave={handleSave}
        isEditing={isEditing}
      />

      {/* Modal de confirmación de eliminación */}
      <ClienteDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        selectedClient={selectedClient}
        onDelete={handleDelete}
      />

      <div
        className="clientes-page container mx-auto p-6"
        style={{
          color: theme.textColor,
          backgroundColor: theme.backgroundColor,
        }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: theme.textColor }}
        >
          Gestión de Clientes
        </h2>

        {/* Control para búsqueda y checkbox de inactivos */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar Cliente"
            className="border border-gray-300 rounded-lg py-2 px-4 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <PermissionWrapper permission="PERMISO_CREAR_CLIENTES">
            <ThemedButton variant="primary" onClick={() => handleOpenModal()}>
              Crear Cliente
            </ThemedButton>
          </PermissionWrapper>

          <PermissionWrapper permission="PERMISO_CREAR_CLIENTES">
            <div className="flex items-center">
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
            </div>
          </PermissionWrapper>
        </div>

        {/* Tabla de clientes */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border-b py-3 px-4 text-left">ID</th>
                <th className="border-b py-3 px-4 text-left">Nombre</th>
                <th className="border-b py-3 px-4 text-left">Email</th>
                <th className="border-b py-3 px-4 text-left">NIT</th>
                <PermissionWrapper permission="PERMISO_CREAR_CLIENTES">
                  <th className="border-b py-3 px-4 text-left">Acciones</th>
                </PermissionWrapper>
              </tr>
            </thead>
            <tbody>
              {currentClientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className={`${cliente.activo ? "" : "bg-gray-200"}`}
                  style={{ color: theme.textColor }}
                >
                  <td className="border-b py-3 px-4">{cliente.id}</td>
                  <td className="border-b py-3 px-4">{`${cliente.nombre} ${cliente.apellido}`}</td>
                  <td className="border-b py-3 px-4">
                    {cliente.email || "No disponible"}
                  </td>
                  <td className="border-b py-3 px-4">
                    {cliente.nit || "No disponible"}
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <PermissionWrapper permission="PERMISO_EDITAR_CLIENTES">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center w-8 h-8 rounded-full shadow-sm"
                        onClick={() => handleOpenModal(cliente)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </PermissionWrapper>

                    <PermissionWrapper permission="PERMISO_ELIMINAR_CLIENTES">
                      <button
                        className={`${
                          cliente.activo
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } py-1 text-white px-3 rounded-lg shadow transform transition hover:scale-105`}
                        onClick={() => handleOpenDeleteModal(cliente)}
                      >
                        {cliente.activo ? (
                          <TrashIcon className="h-4 w-4" />
                        ) : (
                          <ArrowPathIcon className="h-4 w-4" />
                        )}
                      </button>
                    </PermissionWrapper>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-8">
          <nav className="inline-flex space-x-2">
            {Array.from(
              { length: Math.ceil(filteredClientes.length / clientsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  } border-gray-300 shadow-sm transition`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default ClientesPage;
