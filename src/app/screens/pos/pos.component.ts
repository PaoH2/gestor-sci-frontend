import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Producto, ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

interface CartItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {

  // Listas de datos
  productos: Producto[] = [];       // Catálogo completo traído del backend
  productosFiltrados: Producto[] = []; // Para el buscador
  carrito: CartItem[] = [];         // El carrito de compras actual

  // Variables de búsqueda
  terminoBusqueda: string = '';

  // Totales
  subtotalGeneral: number = 0;
  impuestos: number = 0; // 16% IVA por ejemplo
  totalGeneral: number = 0;

  isLoading: boolean = true;

  constructor(
    private apiService: ApiService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  goBack(): void {
    this.location.back();
  }

  cargarProductos() {
    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data; // Inicialmente mostramos todos
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar productos", err);
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DEL BUSCADOR ---
  filtrarProductos() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.Nombre_Producto.toLowerCase().includes(termino) ||
      p.SKU.toLowerCase().includes(termino)
    );
  }

  // --- LÓGICA DEL CARRITO ---

  agregarAlCarrito(producto: Producto) {
    if (producto.Stock_Actual <= 0) {
      alert("No hay stock disponible para este producto.");
      return;
    }

    // Buscamos si ya existe en el carrito
    const itemExistente = this.carrito.find(item => item.producto.ID_Producto === producto.ID_Producto);

    if (itemExistente) {
      // Si existe, validamos stock antes de sumar
      if (itemExistente.cantidad + 1 > producto.Stock_Actual) {
        alert("Stock insuficiente para agregar más unidades.");
        return;
      }
      itemExistente.cantidad++;
      itemExistente.subtotal = itemExistente.cantidad * Number(producto.Costo);
    } else {
      // Si no existe, lo agregamos nuevo
      this.carrito.push({
        producto: producto,
        cantidad: 1,
        subtotal: Number(producto.Costo)
      });
    }

    this.calcularTotales();
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotales();
  }

  cambiarCantidad(index: number, evento: any) {
    const nuevaCantidad = Number(evento.target.value);
    const item = this.carrito[index];

    // Validaciones
    if (nuevaCantidad <= 0) {
      this.eliminarDelCarrito(index);
      return;
    }

    if (nuevaCantidad > item.producto.Stock_Actual) {
      alert(`Solo hay ${item.producto.Stock_Actual} unidades disponibles.`);
      evento.target.value = item.cantidad; // Regresamos al valor anterior
      return;
    }

    // Actualizamos
    item.cantidad = nuevaCantidad;
    item.subtotal = item.cantidad * Number(item.producto.Costo);
    this.calcularTotales();
  }

  calcularTotales() {
    this.subtotalGeneral = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
    this.impuestos = this.subtotalGeneral * 0.16; // Ejemplo IVA 16%
    this.totalGeneral = this.subtotalGeneral + this.impuestos;
  }

  limpiarCarrito() {
    this.carrito = [];
    this.calcularTotales();
    this.terminoBusqueda = '';
    this.filtrarProductos();
  }

  // --- LÓGICA DE VENTA Y TICKET ---

  procesarVenta() {
    if (this.carrito.length === 0) return;

    if (confirm(`¿Confirmar venta por $${this.totalGeneral.toFixed(2)}?`)) {
      this.isLoading = true;

      // 1. Preparamos los datos
      const datosVenta = {
        total: this.totalGeneral,
        items: this.carrito.map(item => ({
          id_producto: item.producto.ID_Producto,
          cantidad: item.cantidad,
          precio: item.producto.Costo
        }))
      };

      // 2. Enviamos al Backend
      this.apiService.registrarVenta(datosVenta).subscribe({
        next: (res) => {
          this.isLoading = false;

          // 3. Generar Ticket y confirmar
          this.imprimirTicket(res.folio, this.carrito, this.totalGeneral);

          alert(`¡Venta Exitosa! Folio: ${res.folio}`);
          this.limpiarCarrito();
          this.cargarProductos(); // Recargamos stock
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert('Error al cobrar: ' + (err.error.error || 'Intente de nuevo.'));
        }
      });
    }
  }

  imprimirTicket(folio: string, items: any[], total: number) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150] // Ticket térmico
    });

    doc.setFontSize(10);
    doc.text('GESTOR SCI - TICKET DE VENTA', 40, 10, { align: 'center' });
    doc.setFontSize(8);
    doc.text(`Folio: ${folio}`, 40, 15, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 40, 20, { align: 'center' });
    doc.text('-------------------------------------------', 40, 25, { align: 'center' });

    const data = items.map(item => [
      item.cantidad,
      item.producto.Nombre_Producto.substring(0, 15),
      `$${(item.cantidad * item.producto.Costo).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Cant', 'Prod', 'Total']],
      body: data,
      startY: 30,
      theme: 'plain',
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fontStyle: 'bold' },
      margin: { left: 5, right: 5 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 5;

    doc.setFontSize(8);
    doc.text(`TOTAL A PAGAR: $${total.toFixed(2)}`, 40, finalY, { align: 'center' });
    doc.text('¡Gracias por su compra!', 40, finalY + 10, { align: 'center' });

    doc.autoPrint(); // Prepara el documento para imprimir
    window.open(doc.output('bloburl'), '_blank'); // Abre una URL segura tipo Blob
  }
}
