import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./components/registrar/registrar.component').then(m => m.RegistrarComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/usuarios/usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent)
      },
      {
        path: 'usuarios/novo',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'usuarios/:id/editar',
        loadComponent: () => import('./components/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
      },
      {
        path: 'usuarios/:id/cartoes',
        loadComponent: () => import('./components/cartoes/cartoes-usuario/cartoes-usuario.component').then(m => m.CartoesUsuarioComponent)
      },
      {
        path: 'cartoes',
        loadComponent: () => import('./components/cartoes/cartoes-list/cartoes-list.component').then(m => m.CartoesListComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
