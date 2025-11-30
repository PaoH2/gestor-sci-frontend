import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isOpen: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const role = this.authService.currentUserValue?.role;
    this.isAdmin = role === 'Superadmin';
  }

  // --- Método para Cerrar Sesión ---
  logout(): void {
    this.authService.logout();
  }
}
