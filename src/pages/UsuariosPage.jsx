import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsuarios,
  deactivateUsuario,
  activateUsuario,
} from "../reducers/usuarioSlice";
import { fetchRoles } from "../reducers/rolSlice";
import UsuarioModal from "../components/UsuarioModal";
import { Pencil, XCircle, CheckCircle, UserPlus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const UsuariosPage = () => {
  const dispatch = useDispatch();
  const { usuarios, loading, error } = useSelector((state) => state.usuarios);
  const { roles } = useSelector((state) => state.roles);
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsuarios());
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCheckboxChange = (e) => setShowInactive(e.target.checked);

  const filteredUsuarios = usuarios
    .filter((usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((usuario) => showInactive || usuario.activo);

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const toggleUserStatus = (id, isActive) => {
    if (isActive) {
      dispatch(deactivateUsuario(id));
    } else {
      dispatch(activateUsuario(id));
    }
  };

  if (loading) return <p className="text-gray-600">Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <UserPlus className="w-6 h-6 mr-2 text-blue-500" /> Gestión de Usuarios
      </h1>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg py-2 px-4 w-full md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <label className="flex items-center gap-2 cursor-pointer text-gray-700">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
          />
          Mostrar inactivos
        </label>
      </div>

      <button
        onClick={() => openModal()}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition shadow-md"
      >
        <UserPlus className="w-5 h-5" /> Agregar Usuario
      </button>

      <div className="overflow-x-auto mt-6">
        <table className="w-full min-w-[600px] border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-3 px-4 border">Nombre</th>
              <th className="py-3 px-4 border">Apellido</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Rol</th>
              <th className="py-3 px-4 border">Estado</th>
              <th className="py-3 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border">{usuario.nombre}</td>
                <td className="py-3 px-4 border">{usuario.apellido}</td>
                <td className="py-3 px-4 border">{usuario.email}</td>
                <td className="py-3 px-4 border text-center">
                  {usuario.rol[0]?.nombre || "Sin rol"}
                </td>
                <td className="py-3 px-4 border text-center">
                  {usuario.activo ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" /> Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <XCircle className="w-5 h-5 mr-1" /> Inactivo
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border flex space-x-2">
                  <button
                    onClick={() => openModal(usuario)}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition duration-150"
                  >
                    <Pencil className="w-5 h-5 mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => toggleUserStatus(usuario.id, usuario.activo)}
                    className={`flex items-center ${
                      usuario.activo
                        ? "text-red-500 hover:text-red-600"
                        : "text-green-500 hover:text-green-600"
                    } transition duration-150`}
                  >
                    {usuario.activo ? (
                      <>
                        <XCircle className="w-5 h-5 mr-1" /> Desactivar
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-1" /> Activar
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <UsuarioModal isOpen={isModalOpen} onClose={closeModal} user={editingUser} roles={roles} />
      )}
    </motion.div>
  );
};

export default UsuariosPage;
