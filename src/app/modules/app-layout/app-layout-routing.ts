import { Routes } from '@angular/router';

import { AppLayoutComponent } from './components/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    // canActivateChild: [() => inject(LoginService).authGuard()],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        title: 'Dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard-routing').then((m) => m.routes),
      },
      {
        path: 'locatori',
        loadChildren: () =>
          import('../locatori/locatori-routing').then((m) => m.routes),
      },
      {
        path: 'inquilini',
        loadChildren: () =>
          import('../inquilini/inquilini-routing').then((m) => m.routes),
      },
      {
        path: 'assegna-casa',
        loadChildren: () =>
          import('../assegna-casa/assegna-casa-routing').then((m) => m.routes),
      },
    ],
  },
];
