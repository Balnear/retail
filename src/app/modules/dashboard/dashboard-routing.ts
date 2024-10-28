import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CaseService } from '../../services/case.service';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('./components/lista-case/lista-case.component'),
    resolve: {
      listaCase: () => inject(CaseService),
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
