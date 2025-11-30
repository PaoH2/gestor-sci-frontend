import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-entrada',
  templateUrl: './registro-entrada.component.html',
  styleUrls: ['./registro-entrada.component.scss']
})
export class RegistroEntradaComponent implements OnInit{

  entradaForm!: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private location: Location
  ){}

  ngOnInit(): void {
        this.entradaForm = this.fb.group({
          SKU: ['', Validators.required],
          Cantidad: [null, [Validators.required, Validators.min(1)]] // Cantidad debe ser al menos 1
        });
      }

      goBack(): void {
        this.location.back();
      }

      onSubmit(): void {
        this.mensajeExito = '';
        this.mensajeError = '';
        this.isLoading = true;

        if (this.entradaForm.invalid) {
          this.isLoading = false;
          this.entradaForm.markAllAsTouched();
          return;
        }

        const datos = {
          SKU: this.entradaForm.value.SKU,
          Cantidad: parseInt(this.entradaForm.value.Cantidad, 10) // Aseguramos que sea número
        };

        this.movimientoService.registrarEntrada(datos).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.mensajeExito = `Entrada registrada. Nuevo stock de ${res.productoActualizado.SKU}: ${res.productoActualizado.Stock_Actual}`;
            this.entradaForm.reset(); // Limpiamos el formulario
          },
          error: (err) => {
            this.isLoading = false;
            this.mensajeError = err.error.error || 'Error desconocido al registrar la entrada.';
            console.error(err);
          }
        });
      }

}
