import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { obtenerVentas } from "../reducers/ventaSlice";
import DetallesVentaModal from "../components/DetallesVentaModal";
import ThemedButton from "../components/ThemedButton";

const VentasPage = () => {
  const dispatch = useDispatch();
  const { ventas, loading, error } = useSelector((state) => state.venta);

  const [selectedVenta, setSelectedVenta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Filtro por texto
  const [startDate, setStartDate] = useState(""); // Fecha inicial
  const [endDate, setEndDate] = useState(""); // Fecha final

  useEffect(() => {
    dispatch(obtenerVentas());
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredVentas = ventas.filter((venta) => {
    const matchesSearchTerm =
      venta.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.id.toString().includes(searchTerm);

    const ventaDate = new Date(venta.fechaVenta);
    const matchesDateRange =
      (!startDate || ventaDate >= new Date(startDate)) &&
      (!endDate || ventaDate <= new Date(endDate));

    return matchesSearchTerm && matchesDateRange;
  });

  const currentVentas = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);

  // Calcular el total de las ventas filtradas
  const totalVentasFiltradas = filteredVentas.reduce(
    (acc, venta) => acc + venta.total,
    0
  );

  const handleRowClick = (venta) => {
    setSelectedVenta(venta);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Cargando ventas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ventas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente o ID de venta"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Cliente</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVentas.map((venta) => (
              <tr key={venta.id}>
                <td className="border border-gray-300 px-4 py-2">{venta.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {venta.cliente?.nombre || "Anónimo"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(venta.fechaVenta).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Bs. {venta.total.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <ThemedButton
                    variant="primary"
                    onClick={() => handleRowClick(venta)}
                  >
                    Ver Detalles
                  </ThemedButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="itemsPerPage" className="mr-2">
            Elementos por página:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-bold">
          Total de Ventas Filtradas: Bs. {totalVentasFiltradas.toFixed(2)}
        </p>
      </div>

      {selectedVenta && (
        <DetallesVentaModal
          venta={selectedVenta}
          onClose={() => setSelectedVenta(null)}
        />
      )}
    </div>
  );
};

export default VentasPage;
