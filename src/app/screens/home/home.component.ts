import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ApiService, Producto } from 'src/app/services/api.service';
import { Chart, registerables } from 'chart.js';

// Registramos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Referencias a los canvas del HTML
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('pieChart') pieChart!: ElementRef;

  metrics: any = null;
  isLoading: boolean = true;

  // Listas procesadas para la UI
  productosBajoStockList: Producto[] = [];
  topProductosList: Producto[] = [];

  chartBarInstance: any;
  chartPieInstance: any;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargar Métricas Generales (Tarjetas)
    this.apiService.getDashboardMetrics().subscribe(data => {
      this.metrics = data;
    });

    // 2. Cargar Productos para generar Gráficos y Tabla
    this.apiService.getProductos().subscribe({
      next: (productos) => {
        this.procesarDatos(productos);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.iniciarGraficos();
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    if (this.chartBarInstance) this.chartBarInstance.destroy();
    if (this.chartPieInstance) this.chartPieInstance.destroy();
  }

  procesarDatos(productos: Producto[]) {
    // A) Filtrar productos con bajo stock para la Tabla
    this.productosBajoStockList = productos.filter(p => {
      const nivel = Number(p.Nivel_Minimo_Stock) || 0;
      return p.Stock_Actual <= nivel && nivel > 0;
    });

    // B) Obtener Top 5 productos con mayor stock para el Gráfico de Barras
    // Ordenamos descendente por stock y tomamos los primeros 5
    this.topProductosList = [...productos]
      .sort((a, b) => b.Stock_Actual - a.Stock_Actual)
      .slice(0, 5);

    // C) Calcular datos para el Gráfico de Pastel (Estado de Stock)
    const stockBajoCount = this.productosBajoStockList.length;
    const stockSuficienteCount = productos.length - stockBajoCount;

    // D) Dibujar los gráficos (usamos setTimeout para asegurar que el HTML ya renderizó los canvas)
    setTimeout(() => {
      this.renderBarChart();
      this.renderPieChart(stockBajoCount, stockSuficienteCount);
    }, 100);
  }

  iniciarGraficos() {
    // Verificamos que los elementos canvas existan
    if (this.barChart && this.pieChart) {
      this.renderBarChart();

      // Calculamos datos para el Pie Chart
      const total = this.topProductosList.length + this.productosBajoStockList.length; // (Simplificado)
      // O mejor, usamos el total real vs bajo stock
      const bajoCount = this.productosBajoStockList.length;
      const okCount = Math.max(0, this.topProductosList.length * 2 - bajoCount); // Simulación visual si faltan datos

      this.renderPieChart(bajoCount, okCount > 0 ? okCount : 10);
    }
  }

  renderBarChart() {
    if (this.chartBarInstance) {
      this.chartBarInstance.destroy();
      this.chartBarInstance = null; // Limpiamos la variable
    }

    const labels = this.topProductosList.map(p => p.Nombre_Producto);
    const data = this.topProductosList.map(p => p.Stock_Actual);

    new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Stock actual',
          data: data,
          backgroundColor: '#F48FB1', // Color rosa similar a tu imagen
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  renderPieChart(bajo: number, suficiente: number) {
    // 1. Limpieza previa (Correcto)
    if (this.chartPieInstance) {
      this.chartPieInstance.destroy();
      this.chartPieInstance = null;
    }

    // 2. Creación de la gráfica (¡AQUÍ FALTABA ESTA LÍNEA!)
    this.chartPieInstance = new Chart(this.pieChart.nativeElement, {
      type: 'doughnut', // O 'pie' si prefieres
      data: {
        labels: ['Bajo stock', 'Suficiente'],
        datasets: [{
          data: [bajo, suficiente],
          backgroundColor: ['#F48FB1', '#90CAF9'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }
}
