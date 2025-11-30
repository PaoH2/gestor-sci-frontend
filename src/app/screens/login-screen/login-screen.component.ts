import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit{

  loginForm!: FormGroup;
  errorMessage: string = ''; // Para mostrar errores (ej. "Credenciales inválidas")
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){
     if (this.authService.isAuthenticated) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // El campo 'email' es obligatorio y debe tener formato de email
      email: ['', [Validators.required, Validators.email]],
      // El campo 'password' es obligatorio
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // Limpiamos errores anteriores y activamos el estado de carga
    this.errorMessage = '';
    this.isLoading = true;

    // Si el formulario no es válido, detenemos
    if (this.loginForm.invalid) {
      this.isLoading = false;
      this.loginForm.markAllAsTouched(); // Muestra los errores de validación
      return;
    }

    // Llamamos al método 'login' de nuestro AuthService
    this.authService.login(this.loginForm.value).subscribe({
      // 'next' se ejecuta si el login es exitoso
      next: (response) => {
        this.isLoading = false;
        // Navegamos a la página principal (puedes cambiar '/home' por la ruta que prefieras)
        this.router.navigate(['/home']);
      },
      // 'error' se ejecuta si el backend devuelve un error
      error: (err) => {
        this.isLoading = false;
        // Mostramos el mensaje de error que nos envía el servidor
        this.errorMessage = err.error.error || 'Ocurrió un error. Por favor, intente de nuevo.';
      }
    });
  }

}
