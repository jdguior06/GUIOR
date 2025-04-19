import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DetalleCajaSesionModal from "../components/DetalleCajaSesionModal";
import ThemedButton from "../components/ThemedButton";
import { fetchCajasSesion } from "../reducers/cajaSesionSlice";

const CajaSesionPage = () => {
  const dispatch = useDispatch();
  const { cajaSesiones, loading, error } = useSelector(
    (state) => state.cajaSesion
  );

  const [selectedCajaSesion, setSelectedCajaSesion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Filtro por texto
  const [startDate, setStartDate] = useState(""); // Fecha inicial
  const [endDate, setEndDate] = useState(""); // Fecha final

  useEffect(() => {
    dispatch(fetchCajasSesion());
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredCajaSesiones = cajaSesiones.filter((cajaSesion) => {
    const matchesSearchTerm =
      cajaSesion.usuario?.nombre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cajaSesion.caja?.id.toString().includes(searchTerm);

    const cajaSesionDate = new Date(cajaSesion.fechaHoraApertura);
    const matchesDateRange =
      (!startDate || cajaSesionDate >= new Date(startDate)) &&
      (!endDate || cajaSesionDate <= new Date(endDate));

    return matchesSearchTerm && matchesDateRange;
  });

  const currentCajaSesiones = filteredCajaSesiones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCajaSesiones.length / itemsPerPage);

  // Calcular el total de las ventas filtradas
  const totalCajaSesionesFiltradas = filteredCajaSesiones.reduce(
    (acc, cajaSesion) => acc + cajaSesion.total,
    0
  );

  const handleRowClick = (cajaSesion) => {
    setSelectedCajaSesion(cajaSesion);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Cargando ventas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sesiones de cajas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por usuario o por caja"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Caja</th>
              <th className="border border-gray-300 px-4 py-2">Usuario</th>
              <th className="border border-gray-300 px-4 py-2">
                Fecha de apertura
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Fecha de cierre
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Monto de apertura
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Monto de cierre
              </th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentCajaSesiones.map((cajaSesion) => (
              <tr key={cajaSesion.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {cajaSesion.caja?.nombre || "Anónimo"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {cajaSesion.usuario?.nombre || "Anónimo"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(cajaSesion.fechaHoraApertura).toLocaleString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    }
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {cajaSesion.fechaHoraCierre
                    ? new Date(cajaSesion.fechaHoraCierre).toLocaleString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        }
                      )
                    : "Abierta"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Bs. {(cajaSesion.saldoInicial || 0).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Bs. {(cajaSesion.saldoFinal || 0).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <ThemedButton
                    variant="primary"
                    onClick={() => handleRowClick(cajaSesion)}
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

      {selectedCajaSesion && (
        <DetalleCajaSesionModal
          ventaProductos={selectedCajaSesion}
          onClose={() => setSelectedCajaSesion(null)}
        />
      )}
    </div>
  );
};

export default CajaSesionPage;
