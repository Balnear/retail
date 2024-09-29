import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment.development';
import { AngularMaterialModule } from './modules/material-module';

export const appConfig: ApplicationConfig = {
  // providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"retail-957d3","appId":"1:591224153669:web:927fa08db0fc893573e52c","storageBucket":"retail-957d3.appspot.com","apiKey":"AIzaSyC3-_3GKDhhxY43dKM-893IuoZY1MdQ8Vs","authDomain":"retail-957d3.firebaseapp.com","messagingSenderId":"591224153669"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
  providers: [
    provideRouter(routes),
    importProvidersFrom(AngularMaterialModule),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
