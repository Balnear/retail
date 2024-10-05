import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component'),
    resolve: {
      // listaCase: () => inject(CaseService).resolveLista(),
    },
    // loadComponent: () => import('./components/lista-case/lista-case.component'),
    // resolve: {
    //   listaCase: () => inject(CaseService).resolveLista(),
    // },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
