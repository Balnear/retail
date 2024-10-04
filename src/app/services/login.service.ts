import { Injectable } from '@angular/core';
import {
  Auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { User as FirebaseUser } from 'firebase/auth'; // Firebase User Type
import { Router } from '@angular/router';
import { Observable, from, map } from 'rxjs';
import { User } from '../models';

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

  /**
   * Il costruttore del service
   * @param {PanelService} panelService L'injectable del service PanelService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo.
   * @param {HttpClient} http L'injectable dell'httpClient
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(private router: Router, private auth: Auth) {}

  /**
   * Effettua l'accesso all'applicazione
   */
  login(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => this.mapFirebaseUserToUser(userCredential.user))
    );
  }

  /**Effettua la disconnessione dall'applicazione */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Metodo per ottenere il profilo dell'utente autenticato
  getCurrentUser(): User | null {
    const firebaseUser = this.auth.currentUser; // Ottieni l'utente Firebase

    const userProfile = this.mapFirebaseUserToUser(firebaseUser); // Mappa a User
    this.saveUserProfileToLocalStorage(userProfile); // Salva nel localStorage

    return userProfile; // Restituisce il profilo dell'utente
  }

  // Mappa l'oggetto Firebase User al modello User
  private mapFirebaseUserToUser(
    firebaseUser: FirebaseUser | null
  ): User | null {
    if (!firebaseUser) {
      return null;
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      emailVerified: firebaseUser.emailVerified,
    };
  }

 // Salva il profilo utente nel localStorage
 private saveUserProfileToLocalStorage(userProfile: User | null): void {
  if (userProfile) {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  } else {
    localStorage.removeItem('userProfile'); // Rimuove il profilo se non c'è un utente
  }
}

// Recupera il profilo utente dal localStorage
getUserProfileFromLocalStorage(): User | null {
  const userProfile = localStorage.getItem('userProfile');
  return userProfile ? JSON.parse(userProfile) : null;
}




  /**Recupero della password */
  recuperaPassword(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then((res) => {
        console.log(res, 'email inviata');
        // this.router.navigate(['/reimposta-password']);
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        console.log(err, 'fallito');
      });
  }
}
