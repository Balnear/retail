import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'bo',
        loadChildren: () =>
          import('./modules/login/login-routing').then(
            (m) => m.routes
          ),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./modules/login/login-routing').then((m) => m.routes),
      },
    //   {
    //     path: 'reimposta-password',
    //     loadChildren: () =>
    //       import(
    //         './modules/nuova-password/reimposta-password-routing.module'
    //       ).then((m) => m.routes),
    //   },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
