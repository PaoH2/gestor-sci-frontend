import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto, ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit{

  productos: Producto[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ){}

  goBack(): void {
    this.location.back(); // Esta simple línea hace toda la magia
  }

  ngOnInit(): void {
    const role = this.authService.currentUserValue?.role;
    this.isAdmin = role === 'Superadmin';

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los productos. Intente de nuevo más tarde.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  editarProducto(sku: string): void {
   this.router.navigate(['/productos/editar', sku]);
 }

 eliminarProducto(sku: string) {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto ${sku}? Esta acción quedará registrada en el historial.`)) {

      this.apiService.deleteProducto(sku).subscribe({
        next: () => {
          alert('Producto eliminado correctamente.');
          this.cargarProductos(); // Recargamos la lista para que desaparezca
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar: ' + (err.error.detail || 'Intente de nuevo.'));
        }
      });
    }
  }

}
