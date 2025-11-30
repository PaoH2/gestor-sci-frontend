import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User, UserService } from 'src/app/services/users.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gestionar-usuarios',
  templateUrl: './gestionar-usuarios.component.html',
  styleUrls: ['./gestionar-usuarios.component.scss']
})
export class GestionarUsuariosComponent implements OnInit{

  users: User[] = [];
    isLoading: boolean = true;
    error: string | null = null;
    currentUserRole: string = '';

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private location: Location
  ){}

  ngOnInit(): void {
      this.currentUserRole = this.authService.currentUserValue?.role || '';
      this.loadUsers();
  }

  loadUsers(): void {
        this.isLoading = true;
        this.error = null;
        this.userService.getUsers().subscribe({
          next: (data) => {
            this.users = data;
            this.isLoading = false;
          },
          error: (err) => {
            this.error = err.error.error || 'No se pudieron cargar los usuarios.';
            this.isLoading = false;
            console.error(err);
          }
        });
      }

      deleteUser(user: User): void {
        // Confirmación antes de borrar
        if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.email}?`)) {
          this.userService.deleteUser(user.id).subscribe({
            next: () => {
              // Si se borra exitosamente, recargamos la lista
              this.loadUsers();
              alert('Usuario eliminado exitosamente.'); // O un mensaje más elegante
            },
            error: (err) => {
              this.error = err.error.error || 'No se pudo eliminar el usuario.';
              console.error(err);
            }
          });
        }
      }

      // Helper para verificar si el usuario actual es Superadmin
      isSuperadmin(): boolean {
        return this.currentUserRole === 'Superadmin';
      }

  goBack(): void {
    this.location.back();
  }
}
