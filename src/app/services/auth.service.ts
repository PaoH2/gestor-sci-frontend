import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base de tu API (apunta al servidor Django)
  private apiUrl = 'http://127.0.0.1:8000/api';

  // --- Claves para el LocalStorage ---
  // Es una buena práctica usar constantes para las claves
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // --- Estado de Autenticación ---
  // BehaviorSubject mantiene el estado actual del usuario (null si no está logueado)
  // y notifica a cualquier componente que esté "escuchando" (suscrito).
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        // 'tap' nos permite ejecutar un "efecto secundario" sin alterar la respuesta
        tap((response: AuthResponse) => {
          // Si el login es exitoso, guardamos los datos
          if (response && response.token && response.user) {
            this.setSession(response);
          }
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    // 1. Borramos los datos del localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // 2. Notificamos a todos los suscriptores que el usuario es nulo (nadie logueado)
    this.currentUserSubject.next(null);
    // 3. Redirigimos al usuario a la página de inicio de sesión
    this.router.navigate(['/login']); // (Deberás crear esta ruta)
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
  }
}
