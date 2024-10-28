import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { LocatoriService } from '../../services';

export const routes: Routes = [
  {
    path: '',
    title: 'Locatori',
    loadComponent: () => import('./components/locatori/locatori.component'),
    resolve: {
      listaLocatori: () => inject(LocatoriService),
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
