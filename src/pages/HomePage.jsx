import FeatureCard from "../components/FeatureCard";
import { DeviceTabletIcon, CurrencyDollarIcon, ChartBarIcon, UserGroupIcon, ClockIcon, CogIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logoguior.png";

const HomePage = () => {
  return (
    <div className="bg-[#FAF3E0] min-h-screen text-[#4B2E2A]">
      {/* Encabezado con Logo y Presentación */}
      <section className="flex flex-col items-center text-center p-8 relative">
        <div className="w-full flex justify-start px-6 md:px-12">
          <img src={logo} alt="Logo Cafetería Payejali" className="w-24 md:w-36" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-4 md:mt-6">
          La experiencia del café en
          <span className="relative inline-block mx-2 text-[#A45C5C]">
            <span className="relative z-10">su máxima expresión</span>
            <span className="absolute inset-0 bg-[#D8A7B1] h-3/4 bottom-1 z-0 rounded rotate-2"></span>
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-medium mt-4 text-[#654321] max-w-3xl">
          Sumérgete en un mundo de aromas y sabores, donde cada taza cuenta una historia. 
          Disfruta de una experiencia única con nuestro café de alta calidad, acompañado de un ambiente acogedor y atención excepcional. ☕
        </p>
      </section>

      {/* Sobre Nosotros */}
      <section className="bg-[#FFF7F0] py-16 text-center px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Sobre Nosotros</h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
          En <strong>Cafetería Payejali</strong>, ...
        </p>
      </section>

      {/* Características del Sistema */}
      <section className="bg-[#FAE3D9] py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Características Exclusivas de Nuestra Cafetería</h2>
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            Nos aseguramos de que la experiencia de nuestros clientes sea excepcional. 
            Desde un servicio ágil hasta opciones digitales, descubre las ventajas de nuestra cafetería.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DeviceTabletIcon className="h-12 w-12 text-[#A45C5C]" />}
              title="Menú Digital"
              description="Ordena y explora nuestro menú desde cualquier dispositivo."
            />
            <FeatureCard
              icon={<CurrencyDollarIcon className="h-12 w-12 text-[#A45C5C]" />}
              title="Pagos Fáciles"
              description="Aceptamos múltiples métodos de pago, incluso digitales."
            />
            <FeatureCard
              icon={<ChartBarIcon className="h-12 w-12 text-[#A45C5C]" />}
              title="Reportes Detallados"
              description="Visualiza estadísticas de ventas y preferencias de clientes."
            />
            <FeatureCard
              icon={<UserGroupIcon className="h-12 w-12 text-[#A45C5C]" />}
              title="Gestión de Personal"
              description="Administra horarios y roles del equipo fácilmente."
            />
            <FeatureCard
              icon={<ClockIcon className="h-12 w-12 text-[#A45C5C]" />}
              title="Pedidos en Línea"
              description="Tus clientes pueden ordenar desde cualquier lugar."
            />
            <FeatureCard
              icon={<CogIcon className="h-12 w-12 text-[#A45C5C]" />}
              title="Personalización Completa"
              description="Adapta el sistema a las necesidades de tu cafetería."
            />
          </div>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="bg-[#4B2E2A] text-white text-center py-6">
        <p className="text-sm">© {new Date().getFullYear()} Cafetería Payejali | Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
