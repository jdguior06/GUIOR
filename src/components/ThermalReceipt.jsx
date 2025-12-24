import { useRef } from 'react';
import logoGuior from '../assets/logoguior.png';
import qrPayejali from '../assets/qr_payejali.png';
import './ThermalReceipt.css';

const ThermalReceipt = ({ ventaData, onClose }) => {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="thermal-container">
      <div className="thermal-receipt" ref={receiptRef}>
        {/* Logo y encabezado */}
        <div className="thermal-header">
          <img src={logoGuior} alt="Logo" className="thermal-logo" />
          <h2 className="thermal-title">FACTURA DE VENTA</h2>
          <p className="thermal-date">{formatDate()}</p>
          <div className="thermal-divider">========================================</div>
        </div>

        {/* Datos del cliente */}
        <div className="thermal-section">
          <p className="thermal-label">CLIENTE</p>
          <p>Nombre: {ventaData.cliente?.nombre || "Anónimo"}</p>
          {ventaData.cliente?.nit && (
            <p>NIT: {ventaData.cliente.nit}</p>
          )}
          {ventaData.cliente?.email && (
            <p>Email: {ventaData.cliente.email}</p>
          )}
          <div className="thermal-divider">----------------------------------------</div>
        </div>

        {/* Productos */}
        <div className="thermal-section">
          <p className="thermal-label">PRODUCTOS</p>
          <table className="thermal-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant</th>
                <th>P.Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventaData.detalleVentaDTOS.map((item, index) => (
                <tr key={index}>
                  <td className="thermal-product-name">{item.nombreProducto}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.precioVenta.toFixed(2)}</td>
                  <td>{(item.precioVenta * item.cantidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="thermal-divider">----------------------------------------</div>
        </div>

        {/* Métodos de pago */}
        {ventaData.metodosPago && ventaData.metodosPago.length > 0 && (
          <div className="thermal-section">
            <p className="thermal-label">MÉTODOS DE PAGO</p>
            {ventaData.metodosPago.map((metodo, index) => (
              <div key={index} className="thermal-payment">
                <span>{metodo.tipoPago}</span>
                <span>Bs. {metodo.monto.toFixed(2)}</span>
              </div>
            ))}
            <div className="thermal-divider">----------------------------------------</div>
          </div>
        )}

        {/* Total */}
        <div className="thermal-section">
          <div className="thermal-total">
            <span className="thermal-total-label">TOTAL A PAGAR:</span>
            <span className="thermal-total-amount">Bs. {ventaData.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="thermal-footer">
          <div className="thermal-divider">========================================</div>

          {/* Sección QR - Destacada */}
          <div className="thermal-qr-section">
            <p className="thermal-web-cta">¡SÍGUENOS PARA CONOCER NUESTRAS NOVEDADES!</p>
            <img src={qrPayejali} alt="QR Code" className="thermal-qr" />
            <p className="thermal-web-message">Escanea el código QR</p>
            <p className="thermal-web-url">www.payejali.com</p>
          </div>

          <div className="thermal-divider">========================================</div>
          <p className="thermal-thanks">¡GRACIAS POR SU COMPRA!</p>
          <p className="thermal-info">Este documento es su comprobante de pago</p>
        </div>
      </div>

      {/* Botones (no se imprimen) */}
      <div className="thermal-actions no-print">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Volver
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Imprimir Factura
        </button>
      </div>
    </div>
  );
};

export default ThermalReceipt;
