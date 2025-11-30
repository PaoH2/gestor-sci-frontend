import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {

  productoForm!: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  isLoading: boolean = true;

  private productoSKU: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ){

  }

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      SKU: [{ value: '', disabled: true }],
      Nombre_Producto: [{ value: '', disabled: true }],
      Descripcion: [''],
      Costo: [null, [Validators.required, Validators.min(0)]]
    });

    // Leé el parámetro 'sku' de la URL actual
    this.productoSKU = this.route.snapshot.paramMap.get('sku');

    // Si encuentra un SKU en la URL, carga los datos del producto
    if (this.productoSKU) {
      this.apiService.getProducto(this.productoSKU).subscribe({
        next: (data) => {
          // Rellena el formulario con los datos recibidos del servidor
          this.productoForm.patchValue(data);
          this.isLoading = false;
        },
        error: (err) => {
          // Si hay un error, mostramos un mensaje
          this.mensajeError = 'No se pudo cargar el producto. Verifique el SKU e inténtelo de nuevo.';
          this.isLoading = false;
        }
      });
    } else {
      // Si no hay SKU en la URL, es un error, así que redirigimos al inicio
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    // Validamos que el formulario sea correcto y que tengamos un SKU
    if (this.productoForm.invalid || !this.productoSKU) {
      return;
    }

    // Limpiamos mensajes anteriores
    this.mensajeExito = '';
    this.mensajeError = '';

    // Creamos un objeto solo con los datos que se pueden actualizar
    const datosActualizados = {
      Descripcion: this.productoForm.get('Descripcion')?.value,
      Costo: this.productoForm.get('Costo')?.value
    };

    // Llamamos al servicio para enviar los datos actualizados al backend
    this.apiService.updateProducto(this.productoSKU, datosActualizados).subscribe({
      next: (res) => {
        this.mensajeExito = '¡Producto actualizado exitosamente!';
      },
      error: (err) => {
        this.mensajeError = err.error.error || 'Ocurrió un error al actualizar el producto.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

}
