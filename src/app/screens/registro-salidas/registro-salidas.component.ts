import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-salidas',
  templateUrl: './registro-salidas.component.html',
  styleUrls: ['./registro-salidas.component.scss']
})
export class RegistroSalidasComponent implements OnInit{

  salidaForm!: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService, // Inyectamos el servicio
    private location: Location
  ){}

  ngOnInit(): void {
    this.salidaForm = this.fb.group({
      SKU: ['', Validators.required],
      Cantidad: [null, [Validators.required, Validators.min(1)]] // La cantidad debe ser al menos 1
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    // Reseteamos los mensajes y activamos la carga
    this.mensajeExito = '';
    this.mensajeError = '';
    this.isLoading = true;

    // Si el formulario es inválido, detenemos
    if (this.salidaForm.invalid) {
      this.isLoading = false;
      this.salidaForm.markAllAsTouched();
      return;
    }

    // Preparamos los datos para enviar
    const datos = {
      SKU: this.salidaForm.value.SKU,
      Cantidad: parseInt(this.salidaForm.value.Cantidad, 10) // Nos aseguramos de que sea un número
    };

    // Llamamos al método 'registrarSalida' del servicio
    this.movimientoService.registrarSalida(datos).subscribe({
      // Si la petición es exitosa
      next: (res) => {
        this.isLoading = false;
        // Mostramos el mensaje de éxito que devuelve el backend
        this.mensajeExito = `Salida registrada. Nuevo stock de ${res.productoActualizado.SKU}: ${res.productoActualizado.Stock_Actual}`;
        this.salidaForm.reset(); // Limpiamos el formulario
      },
      // Si el backend devuelve un error
      error: (err) => {
        this.isLoading = false;

        if (err.status === 400 && err.error.error === 'Stock insuficiente') {
          this.mensajeError = `Error: Stock insuficiente. Solo quedan ${err.error.stockDisponible} unidades de este producto.`;
        }
        // Manejamos otros errores comunes
        else if (err.status === 404) {
           this.mensajeError = err.error.error; // Ej: "Producto con SKU '...' no encontrado."
        } else {
          // Error genérico
          this.mensajeError = 'Error desconocido al registrar la salida. Verifique la consola.';
        }
        console.error(err);
      }
    });
  }

}
