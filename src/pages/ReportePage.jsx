import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchSucursales } from "../reducers/sucursalSlice";
import { fetchAlmacenes } from "../reducers/almacenSlice";
import { fetchProductos } from "../reducers/productoSlice";
import { fetchProveedores } from "../reducers/proveedorSlice";
import { fetchProductosAlmacen } from "../reducers/productAlmacenSlice";

const ReportePage = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [sucursalId, setSucursalId] = useState("all");
  const [almacenId, setAlmacenId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [proveedoresId, setProveedoresId] = useState("");
  const [almacenesCargados, setAlmacenesCargados] = useState(false); // Nuevo estado

  const dispatch = useDispatch();

  const sucursales = useSelector((state) => state.sucursales.sucursales);
  console.log("Sucursales:", sucursales);
  const almacenes = useSelector((state) => state.almacenes.almacenes);
  console.log("Almacenes:", almacenes);
  const productos = useSelector((state) => state.productos.productos);
  const proveedores = useSelector((state) => state.proveedores.proveedores);
  const productosAlmacen = useSelector((state) => state.productAlmacenes?.productosAlmacen || []);

  useEffect(() => {
    dispatch(fetchSucursales());
    dispatch(fetchProveedores());
  }, [dispatch]);

  useEffect(() => {
    const fetchAlmacenesBySucursal = async () => {
      if (sucursalId === "all" && sucursales.length > 0) {
        // Solo ejecutar cuando haya sucursales cargadas y se seleccionen todas
        await Promise.all(
          sucursales.map((sucursal) => dispatch(fetchAlmacenes(sucursal.id)))
        );
        setAlmacenesCargados(true);
      } else if (sucursalId !== "all") {
        // Cargar almacenes para una sucursal específica
        dispatch(fetchAlmacenes(sucursalId));
        setAlmacenId("all");
        setAlmacenesCargados(true);
      }
    };
    fetchAlmacenesBySucursal();
  }, [dispatch, sucursales, sucursalId]);

  useEffect(() => {
    if (almacenId && almacenId !== "all") {
      dispatch(fetchProductos(almacenId));
      dispatch(fetchProductosAlmacen(almacenId));
    }
  }, [dispatch, almacenId]);

  const generatePDF = () => {

    console.log("Fecha Inicio:", fechaInicio);
    console.log("Fecha Fin:", fechaFin);
    console.log("Sucursal seleccionada:", sucursalId);
    console.log("Almacén seleccionado:", almacenId);
    console.log("Producto seleccionado:", productoId);
    console.log("Proveedor seleccionado:", proveedoresId);
    console.log("Productos en Almacén:", productosAlmacen);
    const doc = new jsPDF();
    doc.text("Reporte", 20, 20);

    if (fechaInicio && fechaFin) {
      doc.text(`Fecha: ${fechaInicio} - ${fechaFin}`, 20, 30);
    }

    // 1. Solo Sucursales seleccionadas FUNCIONA
    if (sucursalId === "all" && (!almacenId || almacenId === "") && !productoId && !proveedoresId) {
      console.log("Generando reporte solo con Sucursales seleccionadas.");
      autoTable(doc, {
        head: [["ID", "Nombre", "Dirección"]],
        body: sucursales.map(s => [s.id, s.nombre, s.direccion]),
        startY: 40
      });
    }

    // 2. Todas las Sucursales y Almacenes MEDIO
    if (sucursalId === "all" && almacenId === "all") {
      console.log("Generando reporte para todas las Sucursales y sus Almacenes.");

      autoTable(doc, {
        head: [["Sucursal", "Almacén"]],
        body: sucursales.flatMap((sucursal) => {
          const almacenesDeSucursal = almacenes.filter((a) => a.sucursal && a.sucursal.id === sucursal.id);
          return almacenesDeSucursal.length > 0
            ? almacenesDeSucursal.map((almacen) => [sucursal.nombre, almacen.descripcion])
            : [[sucursal.nombre, "Sin almacenes"]];
        }),
        startY: 40,
      });
    }


    // 3. Una Sucursal y todos sus Almacenes FUNCIONA
    else if (sucursalId && almacenId === "all" && !productoId && !proveedoresId) {
      const selectedAlmacenes = almacenes.filter(a => a.sucursal.id === Number(sucursalId));
      autoTable(doc, {
        head: [["Almacén"]],
        body: selectedAlmacenes.map(a => [a.descripcion]),
        startY: 40
      });
    }

    // 4. Todos los Productos (sin relación con sucursal o almacén)
    else if (sucursalId === "all" && almacenId === "all" && productoId === "all" && !proveedoresId) {
      autoTable(doc, {
        head: [["Nombre", "Descripción", "Stock"]],
        body: productosAlmacen.map(p => [p.nombre, p.descripcion, p.stock]),
        startY: 40
      });
    }

     // 5. Sucursal y Almacén específicos, Todos los Productos en ese Almacén 
     else if (sucursalId && almacenId && productoId === "all" && !proveedoresId) {
      const selectedSucursal = sucursales.find(s => s.id === sucursalId);
      const selectedAlmacen = almacenes.find(a => a.id === almacenId);
      autoTable(doc, {
        head: [["Sucursal", "Almacén", "Producto", "Descripción", "Stock"]],
        body: productosAlmacen.map(p => [
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
else if (sucursalId && almacenId && productoId && !proveedoresId && productoId !== "all") {
  const selectedSucursal = sucursales.find(s => s.id === Number(sucursalId));
  const selectedAlmacen = almacenes.find(a => a.id === Number(almacenId));
  const selectedProducto = productos.find(p => p.id === Number(productoId));
  const productoAlmacen = productosAlmacen.find(p => p.id_producto === Number(productoId) && p.almacen_id === Number(almacenId));
  if (selectedProducto && productoAlmacen) {
    doc.text(`Sucursal: ${selectedSucursal ? selectedSucursal.nombre : ""}`, 20, 40);
    doc.text(`Almacén: ${selectedAlmacen ? selectedAlmacen.descripcion : ""}`, 20, 50);
    doc.text(`Producto: ${selectedProducto.nombre}`, 20, 60);
    doc.text(`Descripción: ${productoAlmacen.descripcion}`, 20, 70);
    doc.text(`Stock: ${productoAlmacen.stock}`, 20, 80);
  }
}

    // 7. Solo Proveedores
    else if (!sucursalId && !almacenId && !productoId && proveedoresId === "all") {
      autoTable(doc, {
        head: [["Proveedor"]],
        body: proveedores.map(p => [p.nombre]),
        startY: 40
      });
    }

    // 8. Sucursal, Almacén, Producto(s), y Proveedores relacionados
    else if (sucursalId && almacenId && (productoId || productoId === "all") && proveedoresId === "all") {
      const proveedoresFiltrados = proveedores.filter(proveedor => 
        productosAlmacen.some(pa => pa.id_proveedor === proveedor.id && pa.almacen_id === almacenId)
      );
      autoTable(doc, {
        head: [["Proveedor"]],
        body: proveedoresFiltrados.map(p => [p.nombre]),
        startY: 40
      });
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
          <button onClick={generatePDF} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Generar Reporte
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Sucursal</label>
            <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="all">Todas las Sucursales</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1", marginRight: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Almacen</label>
            <select value={almacenId} onChange={(e) => setAlmacenId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="all">Todos los Almacenes</option>
              {almacenes.map((almacen) => (
                <option key={almacen.id} value={almacen.id}>
                  {almacen.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Productos</label>
            <select value={productoId} onChange={(e) => setProductoId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="all">Todos los Productos</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#555" }}>Proveedores</label>
            <select value={proveedoresId} onChange={(e) => setProveedoresId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="all">Todos los Proveedores</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportePage;
