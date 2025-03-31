import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUsuario, updateUsuario } from '../reducers/usuarioSlice';
import { User, Mail, Lock, Briefcase, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

const UsuarioModal = ({ isOpen, onClose, user, roles }) => {
  const dispatch = useDispatch();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activo, setActivo] = useState(true);
  const [rolId, setRolId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setApellido(user.apellido);
      setEmail(user.email);
      setActivo(user.activo);
      setRolId(user.rol?.id || '');
    } else {
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setActivo(true);
      setRolId('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const usuarioData = { nombre, apellido, email, password, activo, rolId };

    if (user) {
      await dispatch(updateUsuario({ id: user.id, usuario: usuarioData }));
    } else {
      await dispatch(addUsuario(usuarioData));
    }

    setLoading(false);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <User size={24} className="text-blue-500" />
          {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        {loading && <p className="text-blue-500 mb-2 flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Creando usuario...</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Nombre"
              required
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Apellido"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Correo electrónico"
              required
            />
          </div>
          {!user && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Contraseña"
                required
              />
            </div>
          )}
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-gray-500" size={18} />
            <select
              value={rolId}
              onChange={(e) => setRolId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Seleccionar Rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>{rol.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  ) : null;
};

export default UsuarioModal;
