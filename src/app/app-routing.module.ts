import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

// Componentes
import { HomeComponent } from './screens/home/home.component';
import { CrearProductoComponent } from './screens/crear-producto/crear-producto.component';
import { ListaComponent } from './screens/lista/lista.component';
import { EditarProductoComponent } from './screens/editar-producto/editar-producto.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { GestionarUsuariosComponent } from './screens/gestionar-usuarios/gestionar-usuarios.component';
import { EditarUsuarioComponent } from './screens/editar-usuario/editar-usuario.component';
import { CrearUsuarioComponent } from './screens/crear-usuario/crear-usuario.component';
import { RegistroEntradaComponent } from './screens/registro-entrada/registro-entrada.component';
import { RegistroSalidasComponent } from './screens/registro-salidas/registro-salidas.component';
import { HistorialMovimientosComponent } from './screens/historial-movimientos/historial-movimientos.component';
import { PosComponent } from './screens/pos/pos.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { HistorialVentasComponent } from './screens/historial-ventas/historial-ventas.component';
import { MinimoStockComponent } from './screens/minimo-stock/minimo-stock.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginScreenComponent, pathMatch: 'full'},

  // Rutas Protegidas
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'listap', component: ListaComponent, canActivate: [AuthGuard]},
  { path: 'entradas', component: RegistroEntradaComponent, canActivate: [AuthGuard]},
  { path: 'salidas', component: RegistroSalidasComponent, canActivate: [AuthGuard]},
  { path: 'historial', component: HistorialMovimientosComponent, canActivate: [AuthGuard]},

  // Ruta POS (Nueva)
  { path: 'pos', component: PosComponent, canActivate: [AuthGuard]},

  // Rutas de Superadmin
  { path: 'crear', component: CrearProductoComponent, canActivate: [AuthGuard], data: {role: 'Superadmin'}},
  { path: 'editarp/:sku', component: EditarProductoComponent, canActivate: [AuthGuard], data: {role: 'Superadmin'}},
  { path: 'gestionarusuarios', component: GestionarUsuariosComponent, canActivate: [AuthGuard], data: {role: 'Superadmin'}},
  { path: 'admin/usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuard], data: {role: 'Superadmin'}},
  { path: 'crearusuario', component: CrearUsuarioComponent, canActivate: [AuthGuard], data: {role: 'Superadmin'}},
  { path: 'ventas', component: HistorialVentasComponent, canActivate: [AuthGuard] },
  { path: 'stock-min', component: MinimoStockComponent, CanActivate: [AuthGuard], data: {role: 'Superadmin'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
