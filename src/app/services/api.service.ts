import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment.prod';

export interface Producto {
  ID_Producto: number;
  SKU: string;
  Nombre_Producto: string;
  Descripcion?: string;
  Costo: number;
  Stock_Actual: number;
  Nivel_Minimo_Stock?: number;
  Fecha_Creacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base de tu API. Apunta al servidor Node.js.
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getProductos(): Observable<Producto[]> {
    // GET suele funcionar sin barra, pero mejor ponérsela por consistencia
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/`);
  }

  getProducto(sku: string): Observable<Producto> {
    // CORRECCIÓN: Quitamos '/sku' de la URL. La ruta correcta es /api/productos/{sku}/
    return this.http.get<Producto>(`${this.apiUrl}/productos/${sku}/`);
  }

  public crearProducto(nuevoProducto: Partial<Producto>): Observable<any> {
     // --- AQUÍ ESTABA EL ERROR ---
     // Agregamos la barra '/' al final de la URL
     return this.http.post(`${this.apiUrl}/productos/`, nuevoProducto);
  }

  updateProducto(sku: string, data: { Descripcion?: string, Costo: number }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/productos/${sku}/`, data);
  }

  deleteProducto(sku: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${sku}/`);
  }

  // --- NUEVO: Método para obtener las métricas del dashboard ---
  getDashboardMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/metrics`);
  }

  registrarVenta(datosVenta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ventas/registrar`, datosVenta);
  }

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/`);
  }
}
