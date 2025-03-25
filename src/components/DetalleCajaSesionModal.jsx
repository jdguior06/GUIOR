import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductosVendidos } from "../reducers/reporteSlice";
import ThemedButton from "./ThemedButton";
import { fetchProductosVendidosExcelApi } from "../services/reporteServices";

const DetalleCajaSesionModal = ({ ventaProductos, onClose }) => {
  const dispatch = useDispatch();
  const { productosVendidos, loading, error } = useSelector(
    (state) => state.reporte
  );

  console.log("Productos en el componente:", productosVendidos);

  useEffect(() => {
    // Cuando se abre el modal, busca los productos vendidos para esta sesión de caja
    if (ventaProductos && ventaProductos.id) {
      dispatch(fetchProductosVendidos(ventaProductos.id));
    }
  }, [dispatch, ventaProductos]);

  // useEffect(() => {
  //   if (ventaProductos?.id) {
  //     console.log(
  //       "Ejecutando fetchProductosVendidos para id:",
  //       ventaProductos.id
  //     );
  //     dispatch(fetchProductosVendidos(ventaProductos.id));
  //   }
  // }, [dispatch, ventaProductos?.id]);

  useEffect(() => {
    console.log(
      "Productos en el componente después de actualizar Redux:",
      productosVendidos
    );
  }, [productosVendidos]);

  const handleExportExcel = async () => {
    try {
      const response = await fetchProductosVendidosExcelApi(ventaProductos.id);
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Reporte_Caja_${ventaProductos.id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      alert("Hubo un error al exportar el reporte.");
    }
  };

  // Si no hay sesión de caja seleccionada, no muestra nada
  if (!ventaProductos) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
        {/* Encabezado del Modal */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Reporte de Productos Vendidos - Sesión de Caja
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Información de la Sesión de Caja */}
        <div className="px-6 py-4 bg-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Caja:</strong> {ventaProductos.caja?.nombre || "N/A"}
              </p>
              <p>
                <strong>Usuario: </strong>{" "}
                {ventaProductos.usuario?.nombre || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>Fecha Apertura: </strong>{" "}
                {new Date(ventaProductos.fechaHoraApertura).toLocaleString()}
              </p>
              <p>
                <strong>Fecha Cierre:</strong>{" "}
                {new Date(ventaProductos.fechaHoraCierre).toLocaleString()}
              </p>
              <p>
                <strong>Monto de Apertura: </strong> Bs.{" "}
                {ventaProductos.saldoInicial.toFixed(2)}
              </p>
              <p>
                <strong>Monto de Cierre:</strong> Bs.{" "}
                {ventaProductos.saldoFinal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido del Reporte */}
        <div className="overflow-x-auto flex-grow">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {loading ? (
                <p>Cargando productos vendidos...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : productosVendidos?.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="bg-gray-200">
                      <th className="border p-2">ID Producto</th>
                      <th className="border p-2">Nombre Producto</th>
                      <th className="border p-2">Cantidad Vendida</th>
                      <th className="border p-2">Precio Unitario</th>
                      <th className="border p-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productosVendidos.map((producto) => (
                      <tr
                        key={producto.idProducto}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {producto.idProducto}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {producto.nombreProducto}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {producto.cantidadTotal}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {producto.precioUnitario.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          Bs. {producto.precioTotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">
                  No se encontraron productos vendidos
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-100 text-right flex-shrink-0">
          <p className="text-lg font-bold">
            Total: Bs. {ventaProductos.totalVentas}
          </p>
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-4 border-t flex justify-between">
          <ThemedButton variant="secondary" onClick={onClose}>
            Cerrar
          </ThemedButton>
          <ThemedButton variant="primary" onClick={handleExportExcel}>
            Exportar a Excel
          </ThemedButton>
        </div>
      </div>
    </div>
  );
};

export default DetalleCajaSesionModal;
