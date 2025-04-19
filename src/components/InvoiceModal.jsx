const InvoiceModal = ({ open, ventaData, onClose, onPrint, buttonText = "Volver al POS" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Factura de Venta</h2>

        <div className="mb-4">
          <h3 className="font-semibold text-lg">Detalles del Cliente:</h3>
          <p>Nombre: {ventaData.cliente?.nombre || "Anónimo"}</p>
          <p>Email: {ventaData.cliente?.email || "No proporcionado"}</p>
          <p>NIT: {ventaData.cliente?.nit || "N/A"}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg">Productos Vendidos:</h3>
          <ul>
            {ventaData.detalleVentaDTOS.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {item.nombreProducto} (x{item.cantidad})
                </span>
                <span>Bs. {(item.precioVenta * item.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg">Métodos de Pago:</h3>
          <ul>
            {ventaData.metodosPago.map((metodo, index) => (
              <li key={index} className="flex justify-between">
                <span>{metodo.tipoPago}</span>
                <span>Bs. {metodo.monto.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg">Total Pagado:</h3>
          <p>Bs. {ventaData.total.toFixed(2)}</p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {buttonText}
          </button>
          <button
            onClick={onPrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Imprimir Factura
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
