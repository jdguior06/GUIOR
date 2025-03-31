import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logoguior.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHome = () => {
    navigate('/home');
  };

  const handlePlanes = () => {
    navigate('/planes');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-[#FAF3E0] shadow-lg fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo Cafetería Payejali" className="w-10 md:w-12" />
          <h1 className="text-2xl font-bold text-[#4B2E2A]">Cafetería Payejali</h1>
        </div>

        {/* Menu toggle button for small screens */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#4B2E2A] focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Links for desktop */}
        <div className={`md:flex space-x-6 ${isMenuOpen ? "hidden" : "block"} md:block`}>
          <button
            onClick={handleHome}
            className="text-[#4B2E2A] py-2 px-4 rounded-lg hover:bg-[#D8A7B1] hover:text-white transition duration-300"
          >
            Inicio
          </button>
          <button
            onClick={handlePlanes}
            className="text-[#4B2E2A] py-2 px-4 rounded-lg hover:bg-[#D8A7B1] hover:text-white transition duration-300"
          >
            Planes de Suscripción
          </button>
          <button
            onClick={handleLogin}
            className="text-[#4B2E2A] py-2 px-4 rounded-lg hover:bg-[#D8A7B1] hover:text-white transition duration-300"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Dropdown menu for mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#FAF3E0] p-4 space-y-4">
          <button
            onClick={handleHome}
            className="text-[#4B2E2A] w-full py-2 px-4 rounded-lg hover:bg-[#D8A7B1] hover:text-white transition duration-300"
          >
            Inicio
          </button>
          <button
            onClick={handlePlanes}
            className="text-[#4B2E2A] w-full py-2 px-4 rounded-lg hover:bg-[#D8A7B1] hover:text-white transition duration-300"
          >
            Planes de Suscripción
          </button>
          <button
            onClick={handleLogin}
            className="text-[#4B2E2A] w-full py-2 px-4 rounded-lg hover:bg-[#D8A7B1] hover:text-white transition duration-300"
          >
            Iniciar Sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
