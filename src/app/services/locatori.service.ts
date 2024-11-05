import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { collectionData, Firestore, getDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Observable, from, switchMap, of, catchError, map } from 'rxjs';
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
}
