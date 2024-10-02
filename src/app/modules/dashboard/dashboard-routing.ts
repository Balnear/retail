import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component'),
    resolve: {
      // listaZone: () => inject(ZoneService).resolveLista(),
    },
    // loadComponent: () => import('./components/lista-zone/lista-zone.component'),
    // resolve: {
    //   listaZone: () => inject(ZoneService).resolveLista(),
    // },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
