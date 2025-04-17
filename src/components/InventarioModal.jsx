import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const InventarioModal = ({ open, onClose, selectedProductoAlmacen, onSave }) => {
    const [formData, setFormData] = useState({
        cantidad: "",
    });

    useEffect(() => {
        setFormData({
            cantidad: selectedProductoAlmacen?.stock || "",
        })
    }, [selectedProductoAlmacen, open]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <p className="text-right cursor-pointer text-gray-500" onClick={onClose}>
          X
        </p>
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Ajustar Stock
          </h3>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={onChange}
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>

    );

};

InventarioModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedProductoAlmacen: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default InventarioModal;