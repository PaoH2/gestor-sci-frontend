    import { Injectable } from '@angular/core';
    import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
    import { Observable } from 'rxjs';
    import { AuthService } from '../services/auth.service';

    @Injectable({
      providedIn: 'root'
    })
    export class AuthGuard implements CanActivate {

      constructor(
        private authService: AuthService,
        private router: Router
      ) {}

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        // Verifica si el usuario está autenticado
        const isAuthenticated = this.authService.isAuthenticated;

        // Verifica si la ruta requiere un rol específico (ej. 'Superadmin')
        const requiredRole = route.data['role']; // Leeremos 'data' de la configuración de ruta

        if (!isAuthenticated) {
          // Si no está autenticado, redirigir al login
          this.router.navigate(['/login']);
          return false;
        }

        // Si se requiere un rol y el usuario no lo tiene
        if (requiredRole) {
            const currentUserRole = this.authService.currentUserValue?.role;
            if (currentUserRole !== requiredRole) {
                // Redirigir a una página de 'acceso denegado' o al home
                this.router.navigate(['/home']); // O a una página '/unauthorized'
                return false;
            }
        }

        // Si está autenticado y (si se requiere rol) tiene el rol correcto, permitir acceso
        return true;
      }

    }
