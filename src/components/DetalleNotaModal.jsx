const DetallesNotaModal = ({ nota, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-red-500 font-bold z-10 hover:text-red-700 transition-colors"
          onClick={onClose}
        >
          Cerrar
        </button>

        {/* Modal Content */}
        <div className="flex-grow overflow-hidden flex flex-col">
          <div className="p-6 flex-shrink-0">
            <h2 className="text-xl font-bold mb-4">
              Detalles de la Nota: {nota.id}
            </h2>

            {/* Nota Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(nota.fecha).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </p>
              <p>
                <strong>Proveedor:</strong>{" "}
                {nota.proveedor?.nombre || "No disponible"}
              </p>
              <p>
                <strong>Monto Total:</strong> Bs. {nota.total}
              </p>
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto flex-grow">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Unitario</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {nota.detalles.map((detalle, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {detalle.producto?.nombre || "No disponible"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {detalle.producto?.categoria?.nombre || "Sin categoría"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {detalle.cantidad}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          Bs. {detalle.costoUnitario}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          Bs. {detalle.subTotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="p-6 bg-gray-100 text-right flex-shrink-0">
            <p className="text-lg font-bold">Total: Bs. {nota.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesNotaModal;
