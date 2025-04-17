import { useState, useMemo, useEffect } from "react";

const MetodoPagoModal = ({ open, onClose, total, onSave }) => {
  const initialMetodoPago = [{ tipoPago: "EFECTIVO", monto: "", detalles: "" }];

  const [metodosPago, setMetodosPago] = useState(initialMetodoPago);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setMetodosPago(initialMetodoPago);
    setError("");
  };

  const cambio = useMemo(() => {
    const sumaPagos = metodosPago.reduce(
      (acc, metodo) => acc + parseFloat(metodo.monto || 0),
      0
    );
    return sumaPagos > total ? (sumaPagos - total).toFixed(2) : "0.00";
  }, [metodosPago, total]);

  const handleMontoChange = (index, value) => {
    const updatedMetodosPago = [...metodosPago];
    updatedMetodosPago[index].monto = value;
    setMetodosPago(updatedMetodosPago);
  };

  const handleMontoBlur = (index) => {
    const updatedMetodosPago = [...metodosPago];
    const monto = parseFloat(updatedMetodosPago[index].monto || 0).toFixed(2);
    updatedMetodosPago[index].monto = monto;
    setMetodosPago(updatedMetodosPago);
  };

  const handleDetallesChange = (index, value) => {
    const updatedMetodosPago = [...metodosPago];
    updatedMetodosPago[index].detalles = value;
    setMetodosPago(updatedMetodosPago);
  };

  const handleAgregarMetodo = () => {
    setMetodosPago([
      ...metodosPago,
      { tipoPago: "TARJETA", monto: "", detalles: "" },
    ]);
  };

  const handleEliminarMetodo = (index) => {
    setMetodosPago(metodosPago.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (metodosPago.length === 0) {
      setError("Debe agregar al menos un método de pago");
      return;
    }

    for (const metodo of metodosPago) {
      if (
        !metodo.monto ||
        isNaN(parseFloat(metodo.monto)) ||
        parseFloat(metodo.monto) <= 0
      ) {
        setError("Todos los montos deben ser números válidos mayores a 0");
        return;
      }
    }

    const sumaPagos = metodosPago.reduce(
      (acc, metodo) => acc + parseFloat(metodo.monto || 0),
      0
    );

    if (sumaPagos < total) {
      setError(
        `El total de los métodos de pago (${sumaPagos.toFixed(
          2
        )}) no cubre el total de la venta (${total.toFixed(2)}).`
      );
      return;
    }

    for (const metodo of metodosPago) {
      if (metodo.tipoPago !== "EFECTIVO" && !metodo.detalles.trim()) {
        setError(
          `Debe proporcionar detalles para el pago con ${metodo.tipoPago}`
        );
        return;
      }
    }

    setError("");
    onSave(
      metodosPago.map((metodo) => ({
        ...metodo,
        monto: parseFloat(metodo.monto || 0),
      }))
    );
    resetState();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Métodos de Pago</h2>
        <div className="space-y-4">
          {metodosPago.map((metodo, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <label className="block font-semibold mb-1">Método de Pago</label>
              <select
                value={metodo.tipoPago}
                onChange={(e) => {
                  const updatedMetodosPago = [...metodosPago];
                  updatedMetodosPago[index].tipoPago = e.target.value;
                  setMetodosPago(updatedMetodosPago);
                }}
                className="border rounded w-full px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="OTROS">Otros</option>
              </select>

              <label className="block font-semibold mb-1">Monto</label>
              <input
                type="number"
                name={`monto-${index}`}
                value={metodo.monto}
                onChange={(e) => handleMontoChange(index, e.target.value)}
                onBlur={() => handleMontoBlur(index)}
                className="border rounded w-full px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ingrese el monto"
                min="0"
                step="0.01"
              />

              <label className="block font-semibold mb-1">Detalles</label>
              <textarea
                value={metodo.detalles}
                onChange={(e) => handleDetallesChange(index, e.target.value)}
                className="border rounded w-full px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />

              {index > 0 && (
                <button
                  onClick={() => handleEliminarMetodo(index)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
                >
                  Eliminar Método
                </button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-500 mt-4 text-center font-semibold">{error}</p>
        )}

        <div className="mt-4 border-t pt-4">
          <p className="text-lg font-semibold">
            Total: <span className="text-green-600">Bs. {total}</span>
          </p>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-lg font-semibold">
            Cambio: <span className="text-green-600">Bs. {cambio}</span>
          </p>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirmar Pago
          </button>
        </div>

        <button
          onClick={handleAgregarMetodo}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
        >
          Agregar Método de Pago
        </button>
      </div>
    </div>
  );
};

export default MetodoPagoModal;
