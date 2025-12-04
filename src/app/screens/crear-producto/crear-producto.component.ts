import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService, Categoria } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent implements OnInit{

  productoForm!: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  categorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private location: Location
  ){}

  ngOnInit(): void {
    this.cargarCategorias();

    this.productoForm = this.fb.group({
      SKU: ['', Validators.required],
      Nombre_Producto: ['', Validators.required],
      Descripcion: [''],
      Costo: [null, [Validators.required, Validators.min(0)]],
      categoria_id: [null, Validators.required]
    });
  }

  cargarCategorias(): void {
    this.apiService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.mensajeError = 'No se pudieron cargar las categorías.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.apiService.crearProducto(this.productoForm.value).subscribe({
      next: (res) => {
        this.mensajeExito = `¡Producto "${this.productoForm.value.Nombre_Producto}" creado exitosamente!`;
        this.productoForm.reset();
        this.productoForm.get('categoria_id')?.setValue(null);
      },
      error: (err) => {
        this.mensajeError = err.error.error || 'Ocurrió un error inesperado al crear el producto.';
      }
    });
  }
}