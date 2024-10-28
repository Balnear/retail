import { Routes } from '@angular/router';
import { InquiliniService } from '../../services';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    title: 'Inquilini',
    loadComponent: () => import('./components/inquilini/inquilini.component'),
    resolve: {
      listaInquilini: () => inject(InquiliniService),
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
