import { Routes } from '@angular/router';
import { CaseAssegnateService } from '../../services';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    title: 'Assegna casa',
    loadComponent: () =>
      import('./components/case-assegnate/case-assegnate.component'),
    resolve: {
      listaCaseAssegnate: () => inject(CaseAssegnateService),
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
