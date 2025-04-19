const CierreCajaModal = ({ open, onClose, sesionData }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative z-10">
        <h2 className="text-2xl font-bold mb-6">Balance de Caja</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Fecha/Hora Apertura:</span>
            <span>
              {new Date(sesionData.sesion.fechaHoraApertura).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Saldo Inicial:</span>
            <span>Bs. {sesionData.sesion.saldoInicial.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Total Ventas:</span>
            <span>
              Bs. {(sesionData.sesion.saldoFinal - sesionData.sesion.saldoInicial).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Saldo Final:</span>
            <span>Bs. {sesionData.sesion.saldoFinal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};


export default CierreCajaModal;