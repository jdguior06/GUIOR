import ThermalReceipt from './ThermalReceipt';

const InvoiceModal = ({ open, ventaData, onClose, onPrint, buttonText = "Volver al POS" }) => {
  if (!open) return null;

  return <ThermalReceipt ventaData={ventaData} onClose={onClose} />;
};

export default InvoiceModal;
