import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MovimientoHistorial, MovimientoService } from 'src/app/services/movimiento.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.component.html',
  styleUrls: ['./historial-movimientos.component.scss']
})
export class HistorialMovimientosComponent implements OnInit{
  movimientos: MovimientoHistorial[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  currentUserRole: string = '';

  constructor(
    private movimientoService: MovimientoService,
    private authService: AuthService,
    private location: Location
  ){}


  ngOnInit(): void {
    // Obtenemos el rol del usuario actual desde el AuthService
    this.currentUserRole = this.authService.currentUserValue?.role || '';
    this.loadHistorial();
  }

  goBack(): void {
    this.location.back();
  }

  loadHistorial(): void {
    this.isLoading = true;
    this.error = null;
    this.movimientoService.getHistorialMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error.error || 'No se pudo cargar el historial de movimientos.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Función helper para que el HTML pueda saber si es Superadmin
  isSuperadmin(): boolean {
    return this.currentUserRole === 'Superadmin';
  }


}
