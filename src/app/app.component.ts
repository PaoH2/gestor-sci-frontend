import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  // BORRA ESTA LÍNEA QUE CAUSA EL ERROR:
  // imports: [AppRoutingModule]  <--- ESTO NO VA AQUÍ
})
export class AppComponent {
  title = 'Gestor SCI';
}
