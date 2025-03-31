import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  crearNotaEntrada,
  fetchNotasBySucursalAlmacen,
} from "../reducers/notaEntradaSlice";
import { fetchAlmacenes } from "../reducers/almacenSlice";
import NotaEntradaForm from "../components/NotaEntradaModal";
import DetallesNotaModal from "../components/DetalleNotaModal";
import { fetchProductosActivos } from "../reducers/productoSlice";
import { useParams } from "react-router-dom";
import { fetchProveedoresActivos } from "../reducers/proveedorSlice";
import ThemedButton from "../components/ThemedButton";

const NotaEntradaPage = () => {
  const dispatch = useDispatch();
  const { id: idSucursal, idAlmacen } = useParams();

  // Estado de Redux
  const notasEntrada = useSelector((state) => state.notasEntrada.notasEntrada || []);
  const loadingNotas = useSelector((state) => state.notasEntrada.loading);
  const productos = useSelector((state) => state.productos.productos);
  const almacenes = useSelector((state) => state.almacenes.almacenes);
  const proveedores = useSelector((state) => state.proveedores.proveedores);

  // Estados para filtros y paginación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (idSucursal && idAlmacen) {
      dispatch(fetchNotasBySucursalAlmacen({ idSucursal, idAlmacen }));
      dispatch(fetchProductosActivos());
      dispatch(fetchAlmacenes(idSucursal));
      dispatch(fetchProveedoresActivos());
    }
  }, [dispatch, idSucursal, idAlmacen]);

  // Lógica de filtrado con verificaciones de seguridad
  const filteredNotas = notasEntrada.filter((nota) => {
    if (!nota) return false;

    // Verificar búsqueda por ID
    const notaId = nota.id ? nota.id.toString() : '';
    const matchesSearchTerm = notaId.includes(searchTerm);

    // Verificar fechas
    let matchesDateRange = true;
    if (nota.fecha) {
      const notaDate = new Date(nota.fecha);
      if (startDate) {
        const startDateTime = new Date(startDate);
        matchesDateRange = matchesDateRange && notaDate >= startDateTime;
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999); // Establecer al final del día
        matchesDateRange = matchesDateRange && notaDate <= endDateTime;
      }
    }

    return matchesSearchTerm && matchesDateRange;
  });

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotas = filteredNotas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotas.length / itemsPerPage);

  // Calcular total con verificación
  const totalNotasFiltradas = filteredNotas.reduce(
    (acc, nota) => acc + (nota.total || 0),
    0
  );

  const handleCreateNota = (formData) => {
    dispatch(crearNotaEntrada(formData))
      .then(() => {
        dispatch(fetchNotasBySucursalAlmacen({ idSucursal, idAlmacen }));
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error al crear la nota de entrada:", error);
      });
  };

  const handleRowClick = (nota) => {
    setSelectedNota(nota);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">Nota de Entrada</h1>
      
      <ThemedButton
        variant="primary"
        className="mb-6"
        onClick={() => setIsModalOpen(true)}
      >
        Crear Nota de Entrada
      </ThemedButton>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por ID de nota"
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

      {/* Lista de Notas */}
      {loadingNotas ? (
        <p>Cargando notas...</p>
      ) : (
        <div className="mb-6">
          {currentNotas.length > 0 ? (
            currentNotas.map((nota) => (
              <div
                key={nota.id}
                className="p-4 border border-gray-300 rounded mb-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(nota)}
              >
                <p><strong>Nota ID:</strong> {nota.id}</p>
                <p><strong>Fecha:</strong> {nota.fecha ? new Date(nota.fecha).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }) : 'Fecha no disponible'}</p>
                <p><strong>Total:</strong> Bs. {(nota.total || 0).toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p>No hay notas disponibles para este almacén.</p>
          )}
        </div>
      )}

      {/* Paginación */}
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
          Total de Notas Filtradas: Bs. {totalNotasFiltradas.toFixed(2)}
        </p>
      </div>

      {isModalOpen && (
        <NotaEntradaForm
          almacenId={idAlmacen}
          productos={productos}
          almacenes={almacenes}
          proveedores={proveedores}
          onSubmit={handleCreateNota}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {selectedNota && (
        <DetallesNotaModal
          nota={selectedNota}
          onClose={() => setSelectedNota(null)}
        />
      )}
    </div>
  );
};

export default NotaEntradaPage;