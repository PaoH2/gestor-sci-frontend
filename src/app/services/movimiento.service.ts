import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Importación estándar de Observable

export interface MovimientoHistorial {
  id: number;
  tipo: 'Entrada' | 'Salida' | 'Ajuste';
  SKU: string;
  Cantidad: number;
  ID_Usuario: number;
  Fecha: string; // Es un string en formato ISO
  Nombre_Producto: string;
  Email_Usuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  registrarEntrada(datos: { SKU: string, Cantidad: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/movimientos/entrada`, datos);
  }

  registrarSalida(datos: { SKU: string, Cantidad: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/movimientos/salida`, datos);
  }

  getHistorialMovimientos(): Observable<MovimientoHistorial[]> {
    return this.http.get<MovimientoHistorial[]>(`${this.apiUrl}/movimientos`);
  }
}
