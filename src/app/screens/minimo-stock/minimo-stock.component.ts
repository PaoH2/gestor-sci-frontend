import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-minimo-stock',
  templateUrl: './minimo-stock.component.html',
  styleUrls: ['./minimo-stock.component.scss']
})
export class MinimoStockComponent implements OnInit{

  minimoForm!: FormGroup; 
  mensajeError: string = '';
  isLoading: boolean = true;

  private productoSKU: string | null = null;
  public productoNombre: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ){}

  ngOnInit(): void {
    this.minimoForm = this.fb.group({
      SKU: [{ value: '', disabled: true }],
      Nombre_Producto: [{ value: '', disabled: true }],
      Nivel_Minimo_Stock: [0, [Validators.required, Validators.min(0)]]
      });

    this.productoSKU = this.route.snapshot.paramMap.get('sku');

    if (this.productoSKU) {
      this.apiService.getProducto(this.productoSKU).subscribe({
        next: (data) => {
          this.productoNombre = data.Nombre_Producto;
          this.minimoForm.patchValue(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.mensajeError = 'No se pudo cargar el producto.';
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/listap']);
    }
  }

  onSubmit(): void {
    if (this.minimoForm.invalid || !this.productoSKU) {
      return;
    }

    this.mensajeExito = '';
    this.mensajeError = '';

    const nivelMinimo = this.minimoForm.get('Nivel_Minimo_Stock')?.value;
    const datosActualizados = { Nivel_Minimo_Stock: nivelMinimo };

    this.apiService.updateProducto(this.productoSKU, datosActualizados).subscribe({
      next: (res) => {
        this.mensajeExito = `Nivel mínimo de stock actualizado a ${nivelMinimo}.`;
      },
      error: (err) => {
        this.mensajeError = err.error.error || 'Ocurrió un error al actualizar.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}