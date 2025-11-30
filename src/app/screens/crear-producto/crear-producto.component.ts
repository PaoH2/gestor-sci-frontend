import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private location: Location
  ){}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      // Campo 'SKU': Valor inicial vacío, es un campo obligatorio (Validators.required).
      SKU: ['', Validators.required],
      // Campo 'Nombre_Producto': Valor inicial vacío, también es obligatorio.
      Nombre_Producto: ['', Validators.required],
      // Campo 'Descripcion': Valor inicial vacío, no tiene validaciones, es opcional.
      Descripcion: [''],
      // Campo 'Costo': Valor inicial nulo, es obligatorio y debe ser un número mayor o igual a 0.
      Costo: [null, [Validators.required, Validators.min(0)]]
    });
  }

  goBack(): void {
    this.location.back(); // Esta simple línea hace toda la magia
  }

  onSubmit(): void {
    // Primero, limpiamos cualquier mensaje anterior para no confundir al usuario.
    this.mensajeExito = '';
    this.mensajeError = '';

    // Si el formulario no cumple con las validaciones, detenemos la ejecución.
    // El botón de envío debería estar deshabilitado, pero esta es una doble protección.
    if (this.productoForm.invalid) {
      // Marcamos todos los campos como "tocados" para que se muestren los mensajes de error de validación.
      this.productoForm.markAllAsTouched();
      return;
    }

    // Si el formulario es válido, llamamos al método 'crearProducto' de nuestro ApiService.
    // Le pasamos el objeto con todos los valores del formulario (this.productoForm.value).
    this.apiService.crearProducto(this.productoForm.value).subscribe({
      // La función 'subscribe' escucha la respuesta del servidor.
      // 'next' se ejecuta si la petición fue exitosa (código 2xx).
      next: (res) => {
        // Mostramos un mensaje de éxito en la interfaz.
        this.mensajeExito = `¡Producto "${this.productoForm.value.Nombre_Producto}" creado exitosamente!`;
        // Limpiamos el formulario para que el usuario pueda agregar otro producto.
        this.productoForm.reset();
      },
      // 'error' se ejecuta si la petición falló (código 4xx o 5xx).
      error: (err) => {
        // Mostramos el mensaje de error que nos envía la API.
        // Si no hay un mensaje específico, mostramos uno genérico.
        this.mensajeError = err.error.error || 'Ocurrió un error inesperado al crear el producto.';
      }
    });
  }

}

