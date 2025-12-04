import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto, ApiService, Categoria } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

const SIN_CATEGORIA_ID = 0;

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productosFiltrados: Producto[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  isAdmin: boolean = false;
  selectedCategoryId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) { }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const role = this.authService.currentUserValue?.role;
    this.isAdmin = role === 'Superadmin';

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = [
          { id: null as any, nombre: 'Todos', descripcion: '' },
          { id: SIN_CATEGORIA_ID, nombre: 'Sin Categoría', descripcion: '' },
          ...data
        ];
        this.selectedCategoryId = this.categorias[0].id;

        this.apiService.getProductos().subscribe({
          next: (productosData) => {
            this.productos = productosData;
            this.aplicarFiltro(this.selectedCategoryId);
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'Error al cargar productos.';
            this.isLoading = false;
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.error = 'Error al cargar categorías.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  seleccionarCategoria(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.aplicarFiltro(categoryId);
  }

  aplicarFiltro(categoryId: number | null): void {
    if (categoryId === null) {
      this.productosFiltrados = this.productos;
    } else if (categoryId === SIN_CATEGORIA_ID) {
      this.productosFiltrados = this.productos.filter(prod => prod.categoria_id === null);
    } else {
      this.productosFiltrados = this.productos.filter(prod => 
        prod.categoria_id !== null && parseFloat(String(prod.categoria_id)) === categoryId
      );
    }
  }

  eliminarProducto(sku: string) {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto ${sku}? Esta acción quedará registrada en el historial.`)) {
      this.apiService.deleteProducto(sku).subscribe({
        next: () => {
          alert('Producto eliminado correctamente.');
          this.cargarDatos();
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar: ' + (err.error.detail || 'Intente de nuevo.'));
        }
      });
    }
  }
}