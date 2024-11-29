import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductosAlmacen } from "../reducers/productAlmacenSlice";

const InventarioPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, idAlmacen } = useParams();

    const { productosAlmacen, loading, error } = useSelector(
        (state) => state.productoAlmacenes // Revisa que sea el reducer correcto
    );

    useEffect(() => {
        if (idAlmacen) {
            dispatch(fetchProductosAlmacen(idAlmacen));
        }
    }, [dispatch, idAlmacen]);

    if (loading) {
        return <p className="text-center text-lg font-semibold">Cargando inventario...</p>;
    }

    if (error) {
        return <p className="text-center text-lg text-red-500">Error: {error}</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Inventario del Almacén <span className="text-blue-600">{idAlmacen}</span>
            </h1>

            <button
                onClick={() =>
                    navigate(`/sucursales/${id}/panel/almacenes/${idAlmacen}/notas-entrada`)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 mb-6"
            >
                Ver Notas de Entrada
            </button>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 shadow-md">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left font-semibold border-b">Producto</th>
                            <th className="py-3 px-6 text-left font-semibold border-b">Stock</th>
                            <th className="py-3 px-6 text-left font-semibold border-b">
                                Última Modificación
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosAlmacen.length > 0 ? (
                            productosAlmacen.map((producto) => (
                                <tr
                                    key={producto.id}
                                    className="hover:bg-gray-100 transition-colors"
                                >
                                    <td className="py-3 px-6 border-b">
                                        {producto.producto.nombre}
                                    </td>
                                    <td className="py-3 px-6 border-b">
                                        {producto.stock}
                                    </td>
                                    <td className="py-3 px-6 border-b">
                                        {new Date(
                                            producto.ultimaModificacion
                                        ).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="py-4 px-6 text-center text-gray-500 border-b"
                                >
                                    No hay productos en este almacén
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventarioPage;
