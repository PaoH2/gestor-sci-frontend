import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  isAdmin: boolean = false;
  userName: string = '';
  //notificationCount: number = 3;

   constructor(
    private authService: AuthService
   )
  {}

  ngOnInit(): void {
    const role = this.authService.currentUserValue?.role;
    this.isAdmin = role === 'Superadmin';
  }

}
