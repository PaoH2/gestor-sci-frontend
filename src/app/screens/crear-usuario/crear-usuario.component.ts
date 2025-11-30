import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Si los campos aún no existen o no han sido tocados, no validar
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }

  // Si las contraseñas no coinciden, devuelve un error
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit{

  userForm!: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  isLoading: boolean = false;
  availableRoles: string[] = ['Superadmin', 'Operador'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Inyectamos AuthService
    private router: Router,
    private location: Location
  ){}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]], // Mínimo 8 caracteres
      confirmPassword: ['', Validators.required],
      role: ['Operador', Validators.required] // Rol por defecto 'Operador'
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.isLoading = true;

    if (this.userForm.invalid) {
      this.isLoading = false;
      this.userForm.markAllAsTouched();
      return;
    }

    // Preparamos los datos a enviar (excluimos confirmPassword)
    const userData = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      role: this.userForm.value.role
    };

    // Llamamos al método register del AuthService
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.mensajeExito = response.message || 'Usuario registrado exitosamente.';
        this.userForm.reset({ role: 'Operador' }); // Resetea el form, manteniendo rol por defecto
        // Opcional: Redirigir a la lista de usuarios
        // this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        this.isLoading = false;
        this.mensajeError = err.error.error || 'Ocurrió un error al registrar el usuario.';
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
