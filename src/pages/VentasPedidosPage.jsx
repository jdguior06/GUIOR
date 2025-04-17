import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { obtenerVentaPorSesionDeCaja } from "../reducers/ventaSlice";


const VentasPedidosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cajaSesion } = useSelector((state) => state.cajaSesion);
  console.log("id de la sesion de caja :", cajaSesion.sesion.id  );
  const { ventas, loading } = useSelector((state) => state.venta); // asume slice ventas

  useEffect(() => {
    if (cajaSesion?.sesion.id) {
      console.log("id de la sesion de caja :", cajaSesion.sesion.id);
      dispatch(obtenerVentaPorSesionDeCaja(cajaSesion.sesion.id));
    }
  }, [cajaSesion, dispatch]);

  const handleCargarPedido = (pedido) => {
    const { caja_sesion_id } = pedido; // o los nombres reales
    navigate(`/cajas/sesion/${caja_sesion_id}`, { state: { pedido } });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ventas y Pedidos</h1>

      {loading && <p>Cargando...</p>}

      <div className="space-y-4">
        {ventas.map((venta) => (
          <div key={venta.id} className="border p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Cliente:</strong> {venta.cliente?.nombre || "Consumidor final"}</p>
                <p><strong>Total:</strong> Bs. {venta.total}</p>
                <p><strong>Tipo:</strong> {venta.estado === "PEDIDO" ? "Pedido" : "Venta"}</p>
              </div>

              {venta.estado === "PENDIENTE" && (
                <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 text-lg font-bold" onClick={() => handleCargarPedido(venta)}>
                  Cargar Pedido
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VentasPedidosPage;