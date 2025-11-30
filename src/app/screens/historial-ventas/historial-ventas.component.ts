import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.scss']
})
export class HistorialVentasComponent implements OnInit{
  ventas: any[] = [];
  isLoading: boolean = true;

  constructor(
    private apiService: ApiService,
    private location: Location
  ){}

  ngOnInit(): void {
    this.apiService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

goBack(): void {
  this.location.back();
}

reimprimirTicket(venta: any) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150]
    });

    doc.setFontSize(10);
    doc.text('GESTOR SCI - REIMPRESION', 40, 10, { align: 'center' });
    doc.setFontSize(8);
    doc.text(`Folio: ${venta.folio}`, 40, 15, { align: 'center' });
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleString()}`, 40, 20, { align: 'center' });
    doc.text('-------------------------------------------', 40, 25, { align: 'center' });

    // Mapeamos los detalles que vienen del backend
    const data = venta.detalles.map((item: any) => [
      item.cantidad,
      item.Nombre_Producto.substring(0, 15),
      `$${Number(item.subtotal).toFixed(2)}`
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
    doc.text(`TOTAL: $${Number(venta.total).toFixed(2)}`, 40, finalY, { align: 'center' });

    doc.output('dataurlnewwindow');
  }

}
