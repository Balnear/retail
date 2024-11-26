import { Injectable } from '@angular/core';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import {
  Auth,
  createUserWithEmailAndPassword,
  deleteUser,
  UserCredential,
} from '@angular/fire/auth';
import { collectionData, Firestore } from '@angular/fire/firestore';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { InquilinoProfile, User } from '../models';
import {
  Observable,
  of,
  from,
  switchMap,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';

/** L'injectable del service inquilini service*/
@Injectable({
  providedIn: 'root',
})
export class InquiliniService {
  /** URL dell'immagine del profilo INQUILINO  */
  imageURL!: string;
  /** Booleana per la verifica dell'email */
  verification!: boolean;
  /** Contiene L'url dell'immagine selezionata */
  imageUrls!: string;
  /**Oggetto per il dettaglio dell'inquilino */
  dettaglioInquilino!: any;
  /** Contiene l'email dell'inquilino*/
  email!: string;
  /**Contiene gli inquilini */
  inquilini!: any;

  /** Il costruttore della classe.*/
  constructor(private auth: Auth, private firestore: Firestore) {}

  /**Metodo per creare un nuovo inquilino */
  creaInquilino(
    locatoreId: string,
    email: string,
    password: string,
    displayName: string,
    userType: 'Locatore' | 'Inquilino',
    phoneNumber: string,
    status: 'Online' | 'Offline',
    photoURL?: string
  ): Observable<InquilinoProfile | null> {
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
          return this.creaInquilinoProfile(
            locatoreId,
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
  private creaInquilinoProfile(
    locatoreId: string,
    uid: string,
    email: string,
    displayName: string,
    userType: 'Locatore' | 'Inquilino',
    phoneNumber: string,
    status: 'Online' | 'Offline',
    photoURL?: string
  ): Observable<InquilinoProfile> {
    const firestore = getFirestore();
    const inquilinoProfile: InquilinoProfile = {
      locatoreId,
      uid,
      email,
      displayName,
      userType,
      phoneNumber,
      status,
      photoURL,
      createdAt: new Date(),
    };
    const locatoreDocRef = doc(firestore, `inquilini/${uid}`);

    return from(setDoc(locatoreDocRef, inquilinoProfile)).pipe(
      map(() => inquilinoProfile),
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
      const usersRef = collection(this.firestore, 'inquilini');
      const emailQuery = query(usersRef, where('email', '==', control.value));
      return getDocs(emailQuery).then((querySnapshot) => {
        return querySnapshot.empty ? null : { emailExists: true };
      });
    };
  }

  /** Ottiene tutti gli utenti con userType = 'Inquilino' */
  getAllInquilini(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'inquilini');
    const locatoriQuery = query(usersRef, where('userType', '==', 'Inquilino'));

    // Usa collectionData per ottenere un Observable di documenti
    return collectionData(locatoriQuery, { uidField: 'uid' }) as Observable<
      User[]
    >;
  }

  /**
   * Recupera i dati di un singolo utente da Firestore
   * @param userId - L'ID dell'inquilino da recuperare
   */
  getInquilino(uid: string): Observable<User | null> {
    // Riferimento al documento utente
    const userDocRef = doc(this.firestore, `inquilini/${uid}`);
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

  /**Aggiornamento email Inquilino */
  updateEmail(
    locatoreId: string,
    email: string,
    password: string,
    displayName: string,
    userType: 'Locatore' | 'Inquilino',
    phoneNumber: string,
    status: 'Online' | 'Offline',
    photoURL?: string,
  ): Observable<InquilinoProfile | null> {
    return this.creaInquilino(
      locatoreId,
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
   * Aggiorna il profilo dell'inquilino in Firestore senza modificare il campo userType e la password
   * @param email La nuova email
   * @param displayName Il nuovo nome visualizzato
   * @param photoURL Il nuovo URL della foto
   * @param phoneNumber Il nuovo numero di telefono
   */
  aggiornaProfiloInquilino(
    locatoreId: string,
    uid: string,
    email: string,
    displayName: string,
    phoneNumber: string,
    photoURL: string
  ): Observable<void> {
    const user = this.auth.currentUser;

    if (user) {
      const userDocRef = doc(this.firestore, `inquilini/${uid}`);

      // Definisci i dati da aggiornare
      const updateData = {
        locatoreId,
        email,
        displayName,
        phoneNumber,
        photoURL,
      };

      return from(updateDoc(userDocRef, updateData)).pipe(
        tap(() => {
          // Aggiorna il localStorage con i nuovi dati
          const storedUser = JSON.parse(
            localStorage.getItem('tenantUser') || '{}'
          );

          // Merge dei dati nuovi con quelli già esistenti
          const updatedUser = { ...storedUser, ...updateData };

          // Salva l'oggetto aggiornato nel localStorage
          localStorage.setItem('tenantUser', JSON.stringify(updatedUser));
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

  /**Metodo per eliminare il profilo dell'utente autenticato o di un qualsiasi inquilino*/
  deleteUserProfile(uid: string): Observable<void> {
    const firestore = getFirestore();
    const userProfileDocRef = doc(firestore, `inquilini/${uid}`);

    return from(deleteDoc(userProfileDocRef)).pipe(
      catchError((error) => {
        console.error("Errore durante l'eliminazione del profilo:", error);
        return throwError(
          () => new Error("Errore durante l'eliminazione del profilo")
        );
      })
    );
  }

  /** Verifica se un'email è presente tra gli inquilini */
  verificaEmailInquilino(email: string): Observable<boolean> {
    const usersRef = collection(this.firestore, 'inquilini');
    const emailQuery = query(usersRef, where('email', '==', email));

    // Specifica il tipo esplicito con <InquilinoProfile[]>
    return collectionData<InquilinoProfile>(emailQuery, {
      idField: 'uid',
    }).pipe(
      map((inquilini: any) => inquilini.length > 0) // Ritorna true se ci sono inquilini con quell'email
    );
  }
}
