import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';

export const routes: Routes = [
  // Página de inicio — elige rol
  {
    path: '',
    loadComponent: () => import('./features/public/home/home.component')
      .then(m => m.HomeComponent)
  },
  // Vista pública cliente — solo con cédula
  {
    path: 'cliente/:cedula',
    loadComponent: () => import('./features/public/client-turns/client-turns.component')
      .then(m => m.ClientTurnsComponent)
  },
  // Vista admin — requiere login
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component')
          .then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-turns/admin-turns.component')
        .then(m => m.AdminTurnsComponent)
  },
  { path: '**', redirectTo: '' }
];