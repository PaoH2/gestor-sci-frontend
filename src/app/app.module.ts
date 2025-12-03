import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // <--- Importamos FormsModule
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CrearProductoComponent } from './screens/crear-producto/crear-producto.component';
import { EditarProductoComponent } from './screens/editar-producto/editar-producto.component';
import { ListaComponent } from './screens/lista/lista.component';
import { HomeComponent } from './screens/home/home.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { GestionarUsuariosComponent } from './screens/gestionar-usuarios/gestionar-usuarios.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { EditarUsuarioComponent } from './screens/editar-usuario/editar-usuario.component';
import { CrearUsuarioComponent } from './screens/crear-usuario/crear-usuario.component';
import { RegistroEntradaComponent } from './screens/registro-entrada/registro-entrada.component';
import { RegistroSalidasComponent } from './screens/registro-salidas/registro-salidas.component';
import { HistorialMovimientosComponent } from './screens/historial-movimientos/historial-movimientos.component';
import { PosComponent } from './screens/pos/pos.component';
import { HistorialVentasComponent } from './screens/historial-ventas/historial-ventas.component';
import { MinimoStockComponent } from './screens/minimo-stock/minimo-stock.component'; // <--- Ruta corregida: 'screens' en plural

@NgModule({
  declarations: [
    AppComponent,
    CrearProductoComponent,
    EditarProductoComponent,
    ListaComponent,
    HomeComponent,
    NavbarComponent,
    LoginScreenComponent,
    SidebarComponent,
    GestionarUsuariosComponent,
    EditarUsuarioComponent,
    CrearUsuarioComponent,
    RegistroEntradaComponent,
    RegistroSalidasComponent,
    HistorialMovimientosComponent,
    PosComponent,
    HistorialVentasComponent,
    MinimoStockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule // <--- ¡Esto habilita el uso de ngModel!
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
