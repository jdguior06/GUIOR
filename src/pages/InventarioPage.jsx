import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ajustarStock,
  fetchProductosAlmacen,
} from "../reducers/productAlmacenSlice";
import ThemedButton from "../components/ThemedButton";
import PermissionWrapper from "../components/PermissionWrapper";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import InventarioModal from "../components/InventarioModal";

const InventarioPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, idAlmacen } = useParams();

  const { productosAlmacen, loading, error } = useSelector(
    (state) => state.productoAlmacenes
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedProductoAlmacen, setSelectedProductoAlmacen] = useState(null);

  useEffect(() => {
    if (idAlmacen) {
      dispatch(fetchProductosAlmacen(idAlmacen));
    }
  }, [dispatch, idAlmacen]);

  const handleOpenModal = (productoAlmacen = null) => {
    setSelectedProductoAlmacen(productoAlmacen);
    setOpenModal(true);
  };

  const handleUpdate = (cantidad) => {
    dispatch(ajustarStock({ id: selectedProductoAlmacen.id, cantidad }));
    setOpenModal(false);
    dispatch(fetchProductosAlmacen(idAlmacen));
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold">
        Cargando inventario...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">
        Inventario del Almacén{" "}
        <span className="text-blue-600">{idAlmacen}</span>
      </h1>

      <ThemedButton
        variant="primary"
        onClick={() =>
          navigate(
            `/sucursales/${id}/panel/almacenes/${idAlmacen}/notas-entrada`
          )
        }
        className="mb-6"
      >
        Ver Notas de Entrada
      </ThemedButton>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left font-semibold border-b">
                Producto
              </th>
              <th className="py-3 px-6 text-left font-semibold border-b">
                Stock
              </th>
              <th className="py-3 px-6 text-left font-semibold border-b">
                Última Modificación
              </th>
              <PermissionWrapper permission="PERMISO_AJUSTAR_STOCK">
                <th className="py-3 px-6 text-left font-semibold border-b">
                  Acción
                </th>
              </PermissionWrapper>
            </tr>
          </thead>
          <tbody>
            {productosAlmacen.length > 0 ? (
              productosAlmacen.map((producto) => (
                <tr
                  key={producto.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 px-6 border-b">{producto.producto.nombre}</td>
                  <td className="py-3 px-6 border-b">{producto.stock}</td>
                  <td className="py-3 px-6 border-b">
                    {new Date(producto.ultimaModificacion).toLocaleDateString(
                      "es-ES",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <PermissionWrapper permission="PERMISO_AJUSTAR_STOCK">
                    <td className="py-3 px-6 border-b">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center w-8 h-8 rounded-full shadow-sm" 
                        onClick={() => handleOpenModal(producto)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </PermissionWrapper>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="py-4 px-6 text-center text-gray-500 border-b"
                >
                  No hay productos en este almacén
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <InventarioModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedProductoAlmacen={selectedProductoAlmacen}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default InventarioPage;
