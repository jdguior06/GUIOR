import { Menu, } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoguior from "../assets/logoguior1.jpg";

const Navbar = ({ toggleSidebar }) => {
  const { theme } = useTheme();

  return (
    <nav
      className="text-white p-4 shadow-lg flex justify-between items-center"
      style={{ backgroundColor: theme.primaryColor }} // Aplicamos el color personalizado
    >
      {/* Icono y título */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden">
          <Menu size={24} className="text-white hover:text-red-300 transition duration-200" />
        </button>
        <div>
          <img
            src={logoguior}
            alt="Banner de la plataforma"
            className="w-10 h-10 md:w-10 md:h-10 lg:w-10 lg:h-10  object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">PAYEJALI</h1>
      </div>

      {/* <div className="hidden md:flex space-x-6 items-center">
        <Link
          to="/"
          className="hover:bg-opacity-75 p-2 rounded-full transition duration-300 hover:shadow-lg"
        >
          <Home size={20} className="m-auto" />
        </Link>
        <Link
          to="/orders"
          className="hover:bg-opacity-75 p-2 rounded-full transition duration-300 hover:shadow-lg"
        >
          <ShoppingCart size={20} className="m-auto" />
        </Link>
        <Link
          to="/menu"
          className="hover:bg-opacity-75 p-2 rounded-full transition duration-300 hover:shadow-lg"
        >
          <ClipboardList size={20} className="m-auto" />
        </Link>
      </div> */}

      {/* <div className="flex items-center space-x-4">
        <ThemedButton variant="secondary" onClick={() => alert('Botón Secundario')}>
          Nueva Orden
        </ThemedButton>
      </div> */}
    </nav>
  );
};

export default Navbar;
