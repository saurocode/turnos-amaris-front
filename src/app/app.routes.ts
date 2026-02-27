import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'turnos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/turn/list-turn/list-turn.component').then(m => m.ListTurnComponent)
      },
      {
        path: 'crear',
        loadComponent: () => import('./features/turn/create-turn/create-turn.component').then(m => m.CreateTurnComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];