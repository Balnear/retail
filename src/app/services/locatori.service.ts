import { Injectable } from '@angular/core';
import {
  Auth,
  deleteUser,
  sendEmailVerification,
  updateEmail,
  verifyBeforeUpdateEmail,
} from '@angular/fire/auth';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import {
  collectionData,
  deleteDoc,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  UserCredential,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  Observable,
  from,
  switchMap,
  of,
  catchError,
  map,
  tap,
  interval,
  takeWhile,
  throwError,
} from 'rxjs';
import { LocatoreProfile, User } from '../models';

/** L'injectable del service locatori service*/
@Injectable({
  providedIn: 'root',
})
export class LocatoriService {
  /** URL dell'immagine del profilo LOCATORE  */
  imageURL!: string;
  /** Booleana per la verifica dell'email */
  verification!: boolean;
  /** Contiene L'url dell'immagine selezionata */
  imageUrls!: string;
  /**Oggetto per il dettaglio del locatore */
  dettaglioLocatore!: any;
  /** Contiene l'email del locatore*/
  email!: string;

  /** Il costruttore della classe.*/
  constructor(private auth: Auth, private firestore: Firestore) {}

  /**Metodo per creare un nuovo locatore */
  creaLocatore(
    email: string,
    password: string,
    displayName: string,
    userType: 'Locatore' | 'Inquilino',
    phoneNumber: string,
    status: 'Online' | 'Offline',
    photoURL?: string
  ): Observable<LocatoreProfile | null> {
    const user = this.auth.currentUser; // Ottieni l'utente corrente

    if (!user) {
      console.error(
        'Utente non autenticato. Impossibile creare un nuovo utente.'
      );
      return of(null);
    }
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((userCredential: UserCredential) => {
        const newUser = userCredential.user;
        if (newUser) {
          return this.creaLocatoreProfile(
            newUser.uid,
            email,
            displayName,
            userType,
            phoneNumber,
            status,
            photoURL
          );
        } else {
          return of(null);
        }
      }),
      catchError((error) => {
        console.error("Errore nella creazione dell'utente:", error);
        return of(null);
      })
    );
  }

  /** Metodo per creare il profilo utente in Firestore */
  private creaLocatoreProfile(
    uid: string,
    email: string,
    displayName: string,
    userType: 'Locatore' | 'Inquilino',
    phoneNumber: string,
    status: 'Online' | 'Offline',
    photoURL?: string
  ): Observable<LocatoreProfile> {
    const firestore = getFirestore();
    const locatoreProfile: LocatoreProfile = {
      uid,
      email,
      displayName,
      userType,
      phoneNumber,
      status,
      photoURL,
      createdAt: new Date(),
    };
    const locatoreDocRef = doc(firestore, `locatori/${uid}`);

    return from(setDoc(locatoreDocRef, locatoreProfile)).pipe(
      map(() => locatoreProfile),
      catchError((error) => {
        console.error('Errore nel salvataggio del profilo:', error);
        throw error;
      })
    );
  }

  /** Verifica se l'email esiste già nel database */
  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === this.email) {
        return of(null);
      }
      const usersRef = collection(this.firestore, 'locatori');
      const emailQuery = query(usersRef, where('email', '==', control.value));
      return getDocs(emailQuery).then((querySnapshot) => {
        return querySnapshot.empty ? null : { emailExists: true };
      });
    };
  }

  /** Ottiene tutti gli utenti con userType = 'Locatore' */
  getAllLocatori(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'locatori');
    const locatoriQuery = query(usersRef, where('userType', '==', 'Locatore'));

    // Usa collectionData per ottenere un Observable di documenti
    return collectionData(locatoriQuery, { uidField: 'uid' }) as Observable<
      User[]
    >;
  }

  /**
   * Recupera i dati di un singolo utente da Firestore
   * @param userId - L'ID del locatore da recuperare
   */
  getLocatore(uid: string): Observable<User | null> {
    // Riferimento al documento utente
    const userDocRef = doc(this.firestore, `locatori/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as User;
          return {
            id: uid,
            ...data,
          };
        } else {
          return null; // L'utente non esiste
        }
      })
    );
  }

  /**Aggiornamento email Locatore */
  updateEmail(
    email: string,
    password: string,
    displayName: string,
    userType: 'Locatore' | 'Inquilino',
    phoneNumber: string,
    status: 'Online' | 'Offline',
    photoURL?: string
  ): Observable<LocatoreProfile | null> {
    return this.creaLocatore(
      email,
      password,
      displayName,
      userType,
      phoneNumber,
      status,
      photoURL
    );
  }

  /**
   * Aggiorna il profilo del locatore in Firestore senza modificare il campo userType e la password
   * @param email La nuova email
   * @param displayName Il nuovo nome visualizzato
   * @param photoURL Il nuovo URL della foto
   * @param phoneNumber Il nuovo numero di telefono
   */
  aggiornaProfiloLocatore(
    uid: string,
    email: string,
    displayName: string,
    phoneNumber: string,
    photoURL: string
  ): Observable<void> {
    const user = this.auth.currentUser;

    if (user) {
      const userDocRef = doc(this.firestore, `locatori/${uid}`);

      // Definisci i dati da aggiornare
      const updateData = { email, displayName, phoneNumber, photoURL };

      return from(updateDoc(userDocRef, updateData)).pipe(
        tap(() => {
          // Aggiorna il localStorage con i nuovi dati
          const storedUser = JSON.parse(
            localStorage.getItem('landlordUser') || '{}'
          );

          // Merge dei dati nuovi con quelli già esistenti
          const updatedUser = { ...storedUser, ...updateData };

          // Salva l'oggetto aggiornato nel localStorage
          localStorage.setItem('landlordUser', JSON.stringify(updatedUser));
        })
      );
    } else {
      throw new Error('Utente non autenticato');
    }
  }

  /**Metodo per eliminare l'utente autenticato */
  deleteCurrentUser(): Observable<string> {
    const user = this.auth.currentUser;

    if (user) {
      const userUid = user.uid; // Salva l'UID per il metodo successivo
      return from(deleteUser(user)).pipe(
        map(() => userUid), // Restituisci l'UID per il metodo successivo
        catchError((error) => {
          console.error("Errore durante l'eliminazione dell'utente:", error);
          return throwError(
            () => new Error("Errore durante l'eliminazione dell'utente")
          );
        })
      );
    } else {
      return throwError(() => new Error('User not authenticated'));
    }
  }

  /**Metodo per eliminare il profilo dell'utente autenticato o di un qualsiasi locatore*/
  deleteUserProfile(uid: string): Observable<void> {
    const firestore = getFirestore();
    const userProfileDocRef = doc(firestore, `locatori/${uid}`);

    return from(deleteDoc(userProfileDocRef)).pipe(
      catchError((error) => {
        console.error("Errore durante l'eliminazione del profilo:", error);
        return throwError(
          () => new Error("Errore durante l'eliminazione del profilo")
        );
      })
    );
  }
}
