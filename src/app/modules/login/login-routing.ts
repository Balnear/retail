import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/login/login.component'),
    children: [],
  },
  {
    path: 'recupera-password',
    loadComponent: () =>
      import('./components/recupera-password/recupera-password.component'),
    children: [],
  },
];
