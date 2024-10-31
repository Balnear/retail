import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import {
  browserSessionPersistence,
  User as FirebaseUser,
  setPersistence,
} from 'firebase/auth';

import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, from, map, switchMap } from 'rxjs';
import { PanelService } from './panel.service';
import { profiloUser, User } from '../models';

/**L'injectable del service login service */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  /** Booleana se il token è in refresh */
  isRefreshingToken: boolean = false;
  /** Booleana se l'utente è loggato */
  isLoggedIn: boolean = false;
  /** L'url della landing page */
  landingUrl!: string;
  /** stato della password se è stato inviata o scaduta o nessun evento */
  tempPasswordStatus: 'default' | 'success' | 'error' = 'default';
  /** Booleana per la verifica dell'email */
  verification: boolean = false;
  /** Nome e Cognome utente in fase di registrazione */
  nomeCognome!: string;
  /** URL dell'immagine del profilo USER  */
  imageURL!: string;
  /** Numero di telefono provvisorio USER  */
  numberPhone!: string;
  /**dati utente */
  datiUser: any;
  /**Subject per tenere traccia dell'utente corrente */
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  /**Observable per permettere ad altri componenti di ascoltare i cambiamenti dell'utente corrente */
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Il costruttore del service
   * @param {PanelService} panelService L'injectable del service PanelService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo.
   * @param {Auth} auth
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private panelService: PanelService,
    private dialog: MatDialog
  ) {
    this.initCurrentUser();
  }

  /**Inizializza l'utente corrente all'avvio del servizio */
  private initCurrentUser() {
    // Ascolta i cambiamenti nello stato di autenticazione dell'utente
    onAuthStateChanged(this.auth, (user) => {
      // Mappa l'utente Firebase al modello User e aggiorna il subject
      this.currentUserSubject.next(this.mapFirebaseUserToUser(user));
    });
  }

  /**
   * Effettua l'accesso all'applicazione
   */
  login(email: string, password: string): Observable<User | null> {
    // Prima imposta la persistenza, poi esegue il login
    // Imposta la persistenza su 'session' per mantenere l'utente autenticato anche dopo il refresh
    return from(setPersistence(this.auth, browserSessionPersistence)).pipe(
      switchMap(() =>
        from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
          switchMap((userCredential) => {
            return this.getUserProfile(userCredential.user.uid).pipe(
              map((profileData) => {
                const user = this.mapFirebaseUserToUser(
                  userCredential.user,
                  profileData
                );

                if (user) {
                  const storageKey =
                    user.userType === 'Locatore'
                      ? 'landlordUser'
                      : 'tenantUser';
                  localStorage.setItem(storageKey, JSON.stringify(user));
                }

                return user;
              })
            );
          })
        )
      )
    );
  }

  /**Recupera il profile del utente */
  private getUserProfile(
    uid: string | undefined
  ): Observable<profiloUser | null> {
    if (!uid) return from([null]); // Restituisce null se uid è undefined
    const userDocRef = doc(this.firestore, `locatori/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data, 'data');

          return {
            uid,
            email: data?.['email'] || '',
            displayName: data?.['displayName'] || '',
            photoURL: data?.['photoURL'] || '',
            emailVerified: data?.['emailVerified'] || false,
            userType: data?.['userType'] || 'Inquilino',
            phoneNumber: data?.['phoneNumber'] || '',
          } as profiloUser;
        } else {
          return null;
        }
      })
    );
  }

  /**Effettua la disconnessione dall'applicazione */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Recupera il profilo dell'utente loggato dal localStorage
   * Restituisce l'utente in base al tipo, o null se non è presente.
   */
  getCurrentUserFromLocalStorage(): User | null {
    const landlordUser = localStorage.getItem('landlordUser');
    const tenantUser = localStorage.getItem('tenantUser');

    // Restituisce il profilo in base al tipo di utente
    const user = landlordUser
      ? JSON.parse(landlordUser)
      : tenantUser
      ? JSON.parse(tenantUser)
      : null;
    console.log('User recuperato dal localStorage:', user);
    return user;
  }

  /** Metodo per ottenere il profilo dell'utente autenticato */
  getCurrentUser(): User | null {
    const firebaseUser = this.auth.currentUser; // Ottieni l'utente Firebase
    const user = this.mapFirebaseUserToUser(firebaseUser); // Mappa a User
    this.saveUserProfileToLocalStorage(user); // Salva nel localStorage
    return user; // Restituisce il profilo dell'utente
  }

  /** Mappa l'oggetto Firebase User al modello User */
  private mapFirebaseUserToUser(
    firebaseUser: FirebaseUser | null,
    profileData?: any
  ): User | null {
    if (!firebaseUser) {
      return null;
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: profileData?.displayName || firebaseUser.displayName || '',
      photoURL: profileData?.photoURL || firebaseUser.photoURL || '',
      emailVerified: firebaseUser.emailVerified,
      userType: profileData?.userType || 'Inquilino',
      phoneNumber: profileData?.phoneNumber || firebaseUser.phoneNumber || '',
    };
  }

  /**Salva il profilo utente nel localStorage */
  saveUserProfileToLocalStorage(userProfile: User | null): void {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('userProfile'); // Rimuove il profilo se non c'è un utente
    }
  }

  /**Recupera l'utente dal localStorage */
  getUserFromLocalStorage(): User | null {
    const userProfile = localStorage.getItem('user');
    return userProfile ? JSON.parse(userProfile) : null;
  }

  /**Recupero della password */
  recuperaPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  /** Naviga all'url del login */
  goToLogin() {
    this.dialog.closeAll();
    if (this.panelService.componentRef) {
      this.panelService.close();
    }
    if (this.panelService.parentComponentRef) {
      this.panelService.parentComponentRef.instance.closeDialog();
    }
    this.router.navigateByUrl('/login');
  }

  /** Esegue il clear del localStorage e del sessionStorage */
  clearStorage(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
}
