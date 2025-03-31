import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReporteProductosPorFecha } from "../reducers/reportesSlices";
import { format } from "date-fns";
import ThemedButton from "../components/ThemedButton";
import { showNotification } from "../utils/toast";
import { fetchProductosVendidosPorFechaExcelApi } from "../services/reporteServices";

const ReporteProductosPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.reportes);

  const [inicioFecha, setInicioFecha] = useState("");
  const [finFecha, setFinFecha] = useState("");

  const handleFetchReporte = () => {
    if (!inicioFecha || !finFecha)
      return showNotification.warning("Selecciona ambas fechas");

    dispatch(
      fetchReporteProductosPorFecha({
        inicioFecha: format(new Date(inicioFecha), "yyyy-MM-dd'T'HH:mm:ss"),
        finFecha: format(new Date(finFecha), "yyyy-MM-dd'T'HH:mm:ss"),
      })
    );
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetchProductosVendidosPorFechaExcelApi(
        format(new Date(inicioFecha), "yyyy-MM-dd'T'HH:mm:ss"),
        format(new Date(finFecha), "yyyy-MM-dd'T'HH:mm:ss")
      );
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Reporte_De_Productos.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      showNotification.warning("Hubo un error al exportar el reporte.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reporte de Productos Vendidos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="datetime-local"
          className="border p-2 rounded w-full"
          value={inicioFecha}
          onChange={(e) => setInicioFecha(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border p-2 rounded w-full"
          value={finFecha}
          onChange={(e) => setFinFecha(e.target.value)}
        />
        <ThemedButton variant="primary" onClick={() => handleFetchReporte()}>
          Consultar
        </ThemedButton>
      </div>

      {status === "loading" && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Producto</th>
                <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                <th className="border border-gray-300 px-4 py-2">
                  Precio Unitario
                </th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.data.productos.map((producto) => (
                <tr key={producto.idProducto} className="border">
                  <td className="border border-gray-300 px-4 py-2">
                    {producto.idProducto}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {producto.nombreProducto}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {producto.cantidadTotal}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Bs. {producto.precioUnitario.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Bs. {producto.precioTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">Total: Bs. {data.data.total}</p>
          </div>
        </div>
      )}

      <ThemedButton variant="primary" onClick={handleExportExcel}>
        Exportar a Excel
      </ThemedButton>
    </div>
  );
};

export default ReporteProductosPage;
