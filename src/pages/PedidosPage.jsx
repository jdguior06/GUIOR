import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerVentas,
  obtenerVentaPorSesionDeCaja,
  obtenerVentaPorId,
  pagarPedido,
  actualizarPedido,
  cancelarPedido,
  limpiarDetalleVenta,
} from "../reducers/ventaSlice";
import { showNotification } from "../utils/toast";
import MetodoPagoModal from "../components/MetodoPagoModal";
import InvoiceModal from "../components/InvoiceModal";

export default function PedidosPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cajaSesion } = useSelector((state) => state.cajaSesion);

  const [isLoading, setIsLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [estadoActual, setEstadoActual] = useState("pedidos");

  const ventas = useSelector((state) => state.venta.ventas) || [];
  const detalleVenta = useSelector((state) => state.venta.detalleVenta);
  const error = useSelector((state) => state.venta.error);
  const loading = useSelector((state) => state.venta.loading);

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setIsLoading(true);
        if (cajaSesion?.sesion.id) {
          await dispatch(
            obtenerVentaPorSesionDeCaja(cajaSesion?.sesion.id)
          ).unwrap();
        } else {
          await dispatch(obtenerVentas()).unwrap();
        }
      } catch (error) {
        showNotification.error(`Error al cargar ventas: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    cargarVentas();
  }, [dispatch, cajaSesion]);

  const handleVerDetalle = async (ventaId) => {
    try {
      await dispatch(obtenerVentaPorId(ventaId)).unwrap();
      setIsDetalleModalOpen(true);
    } catch (error) {
      showNotification.error(`Error al obtener detalles: ${error.message}`);
    }
  };

  const handlePagar = (venta) => {
    setVentaSeleccionada(venta);
    setIsPagoModalOpen(true);
  };

  const handleConfirmarPago = async (metodosPago) => {
    try {
      if (!metodosPago || metodosPago.length === 0) {
        showNotification.error("Debe especificar al menos un método de pago");
        return;
      }

      const total = ventaSeleccionada.total;
      const sumaPagos = metodosPago.reduce(
        (acc, metodo) => acc + parseFloat(metodo.monto || 0),
        0
      );

      if (sumaPagos < total) {
        showNotification.error(
          `El monto total de pago (${sumaPagos.toFixed(
            2
          )}) es menor al total de la venta (${total.toFixed(2)})`
        );
        return;
      }

      await dispatch(
        pagarPedido({
          id: ventaSeleccionada.id,
          metodosPago: metodosPago,
        })
      ).unwrap();

      // Preparar datos para el invoice modal
      const invoiceData = {
        cliente: ventaSeleccionada.cliente,
        detalleVentaDTOS: ventaSeleccionada.detalleVentaList.map((item) => ({
          nombreProducto: item.nombreProducto,
          cantidad: item.cantidad,
          precioVenta: item.precio,
        })),
        metodosPago: metodosPago,
        total: ventaSeleccionada.total,
      };

      setVentaSeleccionada(invoiceData);
      showNotification.success("Pedido pagado con éxito");
      setIsPagoModalOpen(false);
      setIsInvoiceModalOpen(true);

      if (cajaSesion?.sesion.id) {
        dispatch(obtenerVentaPorSesionDeCaja(cajaSesion?.sesion.id));
      } else {
        dispatch(obtenerVentas());
      }
    } catch (error) {
      showNotification.error(`Error al pagar pedido: ${error.message}`);
    }
  };

  const handleCloseInvoice = () => {
    setIsInvoiceModalOpen(false);
  };

  const handleCancelar = async (ventaId) => {
    if (window.confirm("¿Está seguro de cancelar este pedido?")) {
      try {
        await dispatch(cancelarPedido(ventaId)).unwrap();
        showNotification.success("Pedido cancelado con éxito");

        if (cajaSesion?.sesion.id) {
          dispatch(obtenerVentaPorSesionDeCaja(cajaSesion?.sesion.id));
        } else {
          dispatch(obtenerVentas());
        }
      } catch (error) {
        showNotification.error(`Error al cancelar pedido: ${error.message}`);
      }
    }
  };

  const handleCerrarDetalleModal = () => {
    setIsDetalleModalOpen(false);
    dispatch(limpiarDetalleVenta());
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const ventasFiltradas = ventas.filter((venta) => {
    if (filtroEstado !== "TODOS" && venta.estado !== filtroEstado) {
      return false;
    }

    if (
      estadoActual === "pedidos" &&
      !["PENDIENTE", "CANCELADA", "COMPLETADA"].includes(venta.estado)
    ) {
      return false;
    }

    if (estadoActual === "ventas" && !["PAGADA"].includes(venta.estado)) {
      return false;
    }

    // Filtro por texto de búsqueda
    if (filtroBusqueda) {
      const searchTerm = filtroBusqueda.toLowerCase();
      const clienteNombre = venta.cliente
        ? `${venta.cliente.nombre} ${venta.cliente.apellido}`.toLowerCase()
        : "";
      const ventaId = venta.id.toString();

      return (
        ventaId.includes(searchTerm) ||
        clienteNombre.includes(searchTerm) ||
        venta.estado.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  const formatoFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleString();
  };

  const getEstadoStyles = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return { color: "bg-yellow-100 text-yellow-800", label: "Pendiente" };
      case "COMPLETADA":
        return { color: "bg-green-100 text-green-800", label: "Completada" };
      case "CANCELADA":
        return { color: "bg-red-100 text-red-800", label: "Cancelada" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: estado };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Pedidos y Ventas</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>

      {/* Pestañas */}
      <div className="mb-6 border-b">
        <div className="flex">
          <button
            className={`py-2 px-4 font-medium ${
              estadoActual === "pedidos"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setEstadoActual("pedidos")}
          >
            Pedidos
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              estadoActual === "ventas"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setEstadoActual("ventas")}
          >
            Ventas
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <input
            type="text"
            placeholder="Buscar por cliente o ID"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:w-1/2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="TODOS">Todos los estados</option>
            {estadoActual === "pedidos" ? (
              <>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="COMPLETADA">COMPLETADA</option>
                <option value="CANCELADA">CANCELADA</option>
              </>
            ) : (
              <>
                <option value="PAGADA">PAGADA</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Listado de ventas/pedidos */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      ) : ventasFiltradas.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-xl">No se encontraron registros</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventasFiltradas.map((venta) => {
                const estadoStyle = getEstadoStyles(venta.estado);
                return (
                  <tr key={venta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {venta.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {venta.cliente
                        ? `${venta.cliente.nombre} ${venta.cliente.apellido}`
                        : "Cliente anónimo"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatoFecha(venta.fechaVenta)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      Bs. {venta.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoStyle.color}`}
                      >
                        {estadoStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleVerDetalle(venta.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Detalles
                      </button>

                      {venta.estado === "PENDIENTE" && (
                        <>
                          <button
                            onClick={() => handlePagar(venta)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Pagar
                          </button>
                          <button
                            onClick={() => handleCancelar(venta.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de pago */}
      {isPagoModalOpen && (
        <MetodoPagoModal
          open={isPagoModalOpen}
          onClose={() => setIsPagoModalOpen(false)}
          total={ventaSeleccionada?.total || 0}
          onSave={handleConfirmarPago}
        />
      )}

      {isInvoiceModalOpen && (
        <InvoiceModal
          open={isInvoiceModalOpen}
          ventaData={ventaSeleccionada}
          onClose={handleCloseInvoice}
          onPrint={handlePrintInvoice}
          buttonText="Volver a Pedidos"
        />
      )}

      {/* Modal de detalle */}
      {isDetalleModalOpen && detalleVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Detalles de Venta #{detalleVenta.id}
              </h2>
              <button
                onClick={handleCerrarDetalleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">
                  Estado:
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      getEstadoStyles(detalleVenta.estado).color
                    }`}
                  >
                    {getEstadoStyles(detalleVenta.estado).label}
                  </span>
                </p>
                <p className="text-gray-600">
                  Fecha: {formatoFecha(detalleVenta.fechaCreacion)}
                </p>
                <p className="text-gray-600">
                  Cliente:{" "}
                  {detalleVenta.cliente
                    ? `${detalleVenta.cliente.nombre} ${detalleVenta.cliente.apellido}`
                    : "Cliente anónimo"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  Total:{" "}
                  <span className="font-semibold">
                    Bs. {detalleVenta.total.toFixed(2)}
                  </span>
                </p>
                {detalleVenta.metodoPagoList &&
                  detalleVenta.metodoPagoList.length > 0 && (
                    <div>
                      <p className="text-gray-600">Métodos de pago:</p>
                      <ul className="list-disc list-inside ml-2">
                        {detalleVenta.metodoPagoList.map((metodo, index) => (
                          <li key={index} className="text-gray-600">
                            {metodo.tipo}: Bs. {metodo.monto.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>

            <h3 className="font-bold text-lg mb-2">Productos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detalleVenta.detalleVentaList.map((detalle, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {detalle.nombreProducto}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {detalle.cantidad}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Bs. {detalle.precio.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        Bs. {(detalle.cantidad * detalle.precio).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCerrarDetalleModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
