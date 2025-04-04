import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductos,
  addProducto,
  updateProducto,
  deleteProducto,
  activarProducto,
} from "../reducers/productoSlice";
import { fetchCategoriasActivo } from "../reducers/categoriaSlice";
import ProductoModal from "../components/ProductoModal";
import ProductoDeleteModal from "../components/ProductoDeleteModal";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import PermissionWrapper from "../components/PermissionWrapper";
import ThemedButton from "../components/ThemedButton";

const ProductosPage = () => {
  const dispatch = useDispatch();
  const { productos, loading, error } = useSelector((state) => state.productos);
  const { categorias } = useSelector((state) => state.categorias);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productosPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchProductos());
    dispatch(fetchCategoriasActivo());
  }, [dispatch]);

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsEditing(!!product);
    setOpenModal(true);
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
  };

  const handleSave = async (producto) => {
    if (isEditing) {
      await dispatch(updateProducto({ id: producto.id, producto }));
    } else {
      await dispatch(addProducto(producto));
    }
    setOpenModal(false);
    dispatch(fetchProductos());
  };

  const handleDelete = async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (producto.activo) {
      await dispatch(deleteProducto(id));
    } else {
      await dispatch(activarProducto(id));
    }
    setOpenDeleteModal(false);
    dispatch(fetchProductos());
  };

  const filteredProductos = productos.filter(
    (producto) =>
      (showInactive || producto.activo) &&
      (producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginación
  const indexOfLastProducto = currentPage * productosPerPage;
  const indexOfFirstProducto = indexOfLastProducto - productosPerPage;
  const currentProductos = filteredProductos.slice(
    indexOfFirstProducto,
    indexOfLastProducto
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center text-xl">Cargando...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      {/* Modales */}
      <ProductoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedProduct={selectedProduct}
        onSave={handleSave}
        isEditing={isEditing}
        categorias={categorias}
      />
      <ProductoDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        selectedProduct={selectedProduct}
        onDelete={handleDelete}
      />

      <div className="productos-page container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Gestión de Productos
        </h2>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar Producto"
            className="border border-gray-300 rounded-lg py-2 px-4 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PermissionWrapper permission="PERMISO_ADMINISTRAR_PRODUCTOS">
            <ThemedButton variant="primary" onClick={() => handleOpenModal()}>
              Crear Producto
            </ThemedButton>
          </PermissionWrapper>

          {/* Checkbox para mostrar inactivos */}
          <div className="flex items-center ml-4">
            <PermissionWrapper permission="PERMISO_ADMINISTRAR_PRODUCTOS">
              <input
                type="checkbox"
                id="showInactive"
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
                checked={showInactive}
                onChange={() => setShowInactive(!showInactive)}
              />
              <label htmlFor="showInactive" className="text-gray-700">
                Mostrar inactivos
              </label>
            </PermissionWrapper>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border-b border-gray-300 py-2 px-3 text-left">
                  Código
                </th>
                <th className="border-b border-gray-300 py-2 px-3 text-left">
                  Nombre
                </th>
                <th className="border-b border-gray-300 py-2 px-3 text-left">
                  Imagen
                </th>
                <th className="border-b border-gray-300 py-2 px-3 text-left">
                  Descripción
                </th>
                <PermissionWrapper permission="PERMISO_ADMINISTRAR_PRODUCTOS">
                  <th className="border-b border-gray-300 py-2 px-3 text-left">
                    Costo
                  </th>
                </PermissionWrapper>
                <th className="border-b border-gray-300 py-2 px-3 text-left">
                  Precio
                </th>
                <th className="border-b border-gray-300 py-2 px-3 text-left">
                  Categoría
                </th>
                <PermissionWrapper permission="PERMISO_ADMINISTRAR_PRODUCTOS">
                  <th className="border-b border-gray-300 py-2 px-3 text-left">
                    Acciones
                  </th>
                </PermissionWrapper>
              </tr>
            </thead>
            <tbody>
              {currentProductos.map((producto) => (
                <tr
                  key={producto.id}
                  className={`${producto.activo ? "" : "bg-gray-200"} `}
                >
                  <td className="border-b border-gray-200 py-1 px-2 text-sm">
                    {producto.codigo}
                  </td>
                  <td className="border-b border-gray-200 py-1 px-2 text-sm">
                    {producto.nombre || "Sin nombre"}
                  </td>
                  <td className="border-b border-gray-200 py-1 px-2">
                    <img
                      src={
                        producto.foto ||
                        "https://via.placeholder.com/60?text=No+Image"
                      }
                      alt={producto.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-1 px-2 text-sm">
                    {producto.descripcion
                      ? producto.descripcion.slice(0, 30) + "..." // Limitar la longitud
                      : "Sin descripción"}
                  </td>
                  <PermissionWrapper permission="PERMISO_ADMINISTRAR_PRODUCTOS">
                    <td className="border-b border-gray-200 py-1 px-2 text-sm">
                      {producto.precioCompra.toFixed(2) || "0.00"} Bs
                    </td>
                  </PermissionWrapper>
                  <td className="border-b border-gray-200 py-1 px-2 text-sm">
                    {producto.precioVenta.toFixed(2) || "0.00"} Bs
                  </td>
                  <td className="border-b border-gray-200 py-1 px-2 text-sm">
                    {producto.categoria?.nombre || "Sin categoría"}
                  </td>
                  <PermissionWrapper permission="PERMISO_ADMINISTRAR_PRODUCTOS">
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center w-8 h-8 rounded-full shadow-sm"
                        onClick={() => handleOpenModal(producto)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        className={`${
                          producto.activo
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } py-1 text-white px-3 rounded-lg shadow transform transition hover:scale-105`}
                        onClick={() => handleOpenDeleteModal(producto)}
                      >
                        {producto.activo ? (
                          <TrashIcon className="h-4 w-4" />
                        ) : (
                          <ArrowPathIcon className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </PermissionWrapper>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-8">
          <nav className="inline-flex space-x-2">
            {Array.from(
              {
                length: Math.ceil(filteredProductos.length / productosPerPage),
              },
              (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  } border-gray-300 shadow-sm transition`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default ProductosPage;
