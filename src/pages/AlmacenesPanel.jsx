import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";
import { theme } from "@cloudinary/url-gen/actions/effect";
import ThemedButton from "../components/ThemedButton";

const AlmacenesPanel = ({ selectedAlmacen }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { teme } = useTheme();

  useEffect(() => {
    if (!selectedAlmacen) {
      navigate("/almacenes");
    }
  }, [selectedAlmacen, navigate]);

  if (!selectedAlmacen) {
    return null;
  }

  const isActiveLink = (path) => {
    return location.pathname.includes(path)
      ? "bg-blue-600 text-white"
      : "text-blue-500";
  };

  return (
    <div
      className="container mx-auto p-3"
      style={{ color: theme.textColor, backgroundColor: theme.backgroundColor }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-3x1 font-bold" style={{ color: theme.textColor}}>
            Almacen - {selectedAlmacen.numero}
        </h2>
        <ThemedButton variant="primary" onClick={() => {navigate("/almacenes"); 
            window.location.reload();
        }}>
            Volver a Almacenes
        </ThemedButton>
      </div>

      <div className="flex space-x-2 mb-3">
        <link
        to={`/sucursales/${id}/panel/almacenes/`}>
        </link>
      </div>
    </div>
  );
};
