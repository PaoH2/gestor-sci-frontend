import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from 'src/app/services/users.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  userForm!: FormGroup;
  currentUser: User | null = null; // Para guardar los datos del usuario
  userId: number | null = null;
  isLoading: boolean = true;
  mensajeExito: string = '';
  mensajeError: string = '';
  availableRoles: string[] = ['Superadmin', 'Operador'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ){}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      role: ['', Validators.required]
    });

    // Obtener el ID del usuario de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = parseInt(idParam, 10);
      this.loadUserData();
    } else {
      this.mensajeError = 'ID de usuario no encontrado en la URL.';
      this.isLoading = false;
      this.router.navigate(['/admin/usuarios']);
    }
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.currentUser = user;
        // Rellenar el formulario con el rol actual
        this.userForm.patchValue({ role: user.role });
        this.isLoading = false;
      },
      error: (err) => {
        this.mensajeError = err.error.error || 'No se pudo cargar la información del usuario.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.userId) {
      return;
    }

    this.mensajeExito = '';
    this.mensajeError = '';
    const newRole = this.userForm.get('role')?.value;

    this.userService.updateUserRole(this.userId, newRole).subscribe({
      next: (res) => {
        this.mensajeExito = res.message || 'Rol de usuario actualizado exitosamente.';
        // Opcional: actualizar el rol en currentUser si quieres que se refleje inmediatamente
        if (this.currentUser) {
          this.currentUser.role = newRole;
        }
      },
      error: (err) => {
        this.mensajeError = err.error.error || 'Ocurrió un error al actualizar el rol.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
