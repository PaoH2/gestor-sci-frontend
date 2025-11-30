import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
    id: number;
    email: string;
    role: string;
  }

@Injectable({
  providedIn: 'root'
})
export class UserService {
      private apiUrl = 'http://127.0.0.1:8000/api';

      constructor(
        private http: HttpClient){}

      getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/usuarios`);
      }

      getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/usuarios/${id}`);
      }

      updateUserRole(id: number, role: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/usuarios/${id}`, { role });
      }

      deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
      }
    }
