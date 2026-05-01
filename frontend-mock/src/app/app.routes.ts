import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'cliente', loadComponent: () => import('./features/cliente/cliente.component').then(m => m.ClienteComponent) },
  { path: 'restaurante', loadComponent: () => import('./features/restaurante/restaurante.component').then(m => m.RestauranteComponent) },
  // Home is handled in AppComponent directly or we could route it.
];
