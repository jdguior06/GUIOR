import { Menu, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoguior from "../assets/logoguior.png";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../reducers/authSlice';
import UserInfo from './UserInfo';

const Navbar = ({ toggleSidebar }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
  };

  return (
    <nav
      className="text-white p-4 shadow-lg flex items-center justify-between bg-white border-b border-gray-200"
      style={{ backgroundColor: theme.primaryColor }}
    >
      {/* Logo e icono de menú */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden">
          <Menu size={24} className="text-white hover:text-red-300 transition duration-200" />
        </button>
        <img
          src={logoguior}
          alt="Banner de la plataforma"
          className="w-10 h-10 md:w-16 md:h-16 object-contain"
        />
        <h1 className="text-2xl font-bold tracking-wide hidden sm:block">PAYEJALI</h1>
      </div>

      {/* Información del usuario y botón de cierre de sesión */}
      <div className="flex items-center space-x-6">
        <div className="hidden sm:block">
          <UserInfo />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 py-2 px-4 bg-red-500 hover:bg-red-600 transition duration-200 rounded-lg text-sm sm:text-base"
        >
          <LogOut size={20} className="text-white" />
          <span className="text-white font-medium hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
