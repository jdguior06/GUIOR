import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchSucursales } from "../reducers/sucursalSlice";
import { fetchProductos } from "../reducers/productoSlice";
import { fetchProductosAlmacen } from "../reducers/productAlmacenSlice";
import { fetchAllAlmacenesSinFiltro } from '../reducers/almacenSlice'; // Importa la nueva acción

const ReportePage = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [sucursalId, setSucursalId] = useState("all");
  const [almacenId, setAlmacenId] = useState(""); 
  const [productoId, setProductoId] = useState("");

  const dispatch = useDispatch();

  const sucursales = useSelector((state) => state.sucursales.sucursales);
  const almacenes = useSelector((state) => state.almacenes.almacenes);
  const productos = useSelector((state) => state.productos.productos);
  const productosAlmacen = useSelector((state) => state.productAlmacenes?.productosAlmacen || []);

  useEffect(() => {
    dispatch(fetchSucursales());
    dispatch(fetchAllAlmacenesSinFiltro()); // Llamada única para obtener todos los almacenes
  }, [dispatch]);

  useEffect(() => {
    if (almacenId && almacenId !== "all") {
      dispatch(fetchProductos(almacenId));
      dispatch(fetchProductosAlmacen(almacenId));
    }
  }, [dispatch, almacenId]);

  const generatePDF = () => {
    // Forzar `almacenId` a `"all"` si `sucursalId` es `"all"` y `almacenId` está vacío
    if (sucursalId === "all" && almacenId === "") {
      setAlmacenId("all");
    }

    const doc = new jsPDF();
    doc.text("Reporte", 20, 20);

    if (fechaInicio && fechaFin) {
      doc.text(`Fecha: ${fechaInicio} - ${fechaFin}`, 20, 30);
    }

    // 1. Solo Sucursales seleccionadas
    if (sucursalId === "all" && almacenId === "" && !productoId) {
      autoTable(doc, {
        head: [["ID", "Nombre", "Dirección"]],
        body: sucursales.map(s => [s.id, s.nombre, s.direccion]),
        startY: 40
      });
    }

    // 2. Todas las Sucursales y Almacenes
    else if (sucursalId === "all" && almacenId === "all" && !productoId) {
      autoTable(doc, {
        head: [["Sucursal", "Almacén"]],
        body: sucursales.flatMap((sucursal) => {
          const almacenesDeSucursal = almacenes.filter(
            (a) => a.sucursal.id === sucursal.id
          );
          return almacenesDeSucursal.length > 0
            ? almacenesDeSucursal.map((almacen) => [sucursal.nombre, almacen.descripcion])
            : [[sucursal.nombre, "Sin almacenes"]];
        }),
        startY: 40,
      });
    }

    // 3. Una Sucursal y todos sus Almacenes
    else if (sucursalId !== "all" && almacenId === "all" && !productoId) {
      const selectedAlmacenes = almacenes.filter(a => a.sucursal.id === Number(sucursalId));
      autoTable(doc, {
        head: [["Almacén"]],
        body: selectedAlmacenes.map(a => [a.descripcion]),
        startY: 40
      });
    }

    // 4. Todos los Productos (sin relación con sucursal o almacén)
    else if (sucursalId === "all" && almacenId === "all" && productoId === "all") {
      autoTable(doc, {
        head: [["Nombre", "Descripción", "Stock"]],
        body: productosAlmacen.map(p => [p.nombre, p.descripcion, p.stock]),
        startY: 40
      });
    }

    // 5. Sucursal y Almacén específicos, Todos los Productos en ese Almacén
    else if (sucursalId && almacenId && productoId === "all") {
      const selectedSucursal = sucursales.find(s => s.id === Number(sucursalId));
      const selectedAlmacen = almacenes.find(a => a.id === Number(almacenId));
      const productosEnAlmacen = productosAlmacen.filter(p => p.almacen_id === Number(almacenId));
    
      autoTable(doc, {
        head: [["Sucursal", "Almacén", "Producto", "Descripción", "Stock"]],
        body: productosEnAlmacen.map(p => [
          selectedSucursal ? selectedSucursal.nombre : "",
          selectedAlmacen ? selectedAlmacen.descripcion : "",
          p.nombre,
          p.descripcion,
          p.stock
        ]),
        startY: 40
      });
    }

    // 6. Sucursal, Almacén, y un Producto específico
    else if (sucursalId && almacenId && productoId && productoId !== "all") {
      const selectedSucursal = sucursales.find(s => s.id === Number(sucursalId));
      const selectedAlmacen = almacenes.find(a => a.id === Number(almacenId));
      const selectedProducto = productos.find(p => p.id === Number(productoId));
      const productoAlmacen = productosAlmacen.find(p => p.id_producto === Number(productoId) && p.almacen_id === Number(almacenId));

      if (selectedProducto && productoAlmacen) {
        autoTable(doc, {
          head: [["Sucursal", "Almacén", "Producto", "Descripción", "Stock"]],
          body: [[
            selectedSucursal ? selectedSucursal.nombre : "",
            selectedAlmacen ? selectedAlmacen.descripcion : "",
            selectedProducto.nombre,
            productoAlmacen.descripcion,
            productoAlmacen.stock
          ]],
          startY: 40
        });
      }
    }

    // Guardar PDF
    doc.save("reporte.pdf");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", color: "#333" }}>Reportes</h1>
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", maxWidth: "700px", margin: "0 auto", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Fecha Inicio</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Fecha Fin</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Sucursal</label>
            <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="all">Todas</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1", marginRight: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Almacén</label>
            <select value={almacenId} onChange={(e) => setAlmacenId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="all">Todos</option>
              {almacenes.map((almacen) => (
                <option key={almacen.id} value={almacen.id}>{almacen.descripcion}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1", marginRight: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Producto</label>
            <select value={productoId} onChange={(e) => setProductoId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="all">Todos</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>{producto.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={generatePDF} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Generar Reporte
        </button>
      </div>
    </div>
  );
};

export default ReportePage;
