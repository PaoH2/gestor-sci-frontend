import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment.prod';

// Definición de la interfaz de Producto
export interface Producto {
  ID_Producto: number;
  SKU: string;
  Nombre_Producto: string;
  Descripcion?: string;
  Costo: number;
  Stock_Actual: number;
  Nivel_Minimo_Stock?: number;
  Fecha_Creacion?: string;
  Nombre_Categoria?: string;
  is_active?: boolean;
  categoria_id?: number | null;
}

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
};


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/`);
  }

  getProducto(sku: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/productos/${sku}/`);
  }

  public crearProducto(nuevoProducto: Partial<Producto>): Observable<any> {
     return this.http.post(`${this.apiUrl}/productos/`, nuevoProducto);
  }

  // --- Método para obtener categorías (Usa la interfaz definida arriba) ---
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias/`);
  }

  updateProducto(sku: string, data: Partial<Producto>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/productos/${sku}/`, data);
  }

  updateNivelMinimoStock(sku: string, nuevoNivel: number): Observable<Producto> {
    const data = {Nivel_Minimo_Stock: nuevoNivel};
    return this.http.patch<Producto>(`${this.apiUrl}/productos/${sku}/`, data);
  }

  deleteProducto(sku: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${sku}/`);
  }

  getDashboardMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/metrics`);
  }

  registrarVenta(datosVenta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ventas/registrar/`, datosVenta);
  }

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/`);
  }
}