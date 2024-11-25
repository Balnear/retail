import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';

import { Casa } from '../models';

/** L'injectable del service case service */
@Injectable({
  providedIn: 'root',
})
export class CaseService {
  /**Tipologia casa */
  tipologie: string[] = [];
  /**Oggetto per il dettaglio della casa */
  dettaglioCasa!: any;
  /**Variabile di appoggio per la gestione di assegna-case tramite id */
  idAssegnato!: boolean;

  constructor(private firestore: Firestore) {}

  /**Funzione per ottenere una casa specifica tramite il suo ID */
  getCasa(casaId: string): Observable<any> {
    const casaDocRef = doc(this.firestore, `case/${casaId}`);
    return from(getDoc(casaDocRef));
  }

  /**
   * Funzione per creare una nuova casa
   * @param {Casa} payload Il payload della chiamata
   * @returns {Observable<any>}
   */
  creaCasa(payload: Casa): Observable<any> {
    const colRef = collection(this.firestore, 'case');
    return from(addDoc(colRef, payload));
  }

  /**Funzione per modificare una casa che ritorna un Observable */
  modificaCasa(casaId: string, datiCasa: any): Observable<void> {
    const casaDocRef = doc(this.firestore, `case/${casaId}`);
    return from(updateDoc(casaDocRef, datiCasa));
  }

  /**Funzione per eliminare una casa basata su casaId */
  eliminaCasa(casaId: string): Observable<void> {
    const casaDocRef = doc(this.firestore, `case/${casaId}`);
    return from(deleteDoc(casaDocRef));
  }

  /** Metodo per ottenere tutti i documenti della collezione "case", con filtro opzionale per locatoreID */
  getAllCase(locatoreId?: string): Observable<any[]> {
    const caseCollectionRef = collection(this.firestore, 'case');

    // Se locatoreName è definito, crea una query con il filtro
    const caseQuery = locatoreId
      ? query(caseCollectionRef, where('locatore.id', '==', locatoreId))
      : caseCollectionRef;

    return collectionData(caseQuery, { idField: 'id' });
  }

  /**Riassegnazione case associate al locatore */
  updateLocatoreIdForCase(
    oldLocatoreId: string,
    newLocatoreId: string | undefined
  ): Observable<void> {
    const caseCollectionRef = collection(this.firestore, 'case');

    // Query per ottenere tutte le case con l'ID locatore specificato
    const caseQuery = query(
      caseCollectionRef,
      where('locatore.id', '==', oldLocatoreId)
    );

    return from(getDocs(caseQuery)).pipe(
      switchMap((querySnapshot) => {
        const updatePromises: Promise<void>[] = [];

        querySnapshot.forEach((docSnap) => {
          const caseDocRef = doc(this.firestore, `case/${docSnap.id}`);
          updatePromises.push(
            updateDoc(caseDocRef, { 'locatore.id': newLocatoreId })
          );
        });

        // Attendi che tutte le operazioni di aggiornamento siano completate
        return from(Promise.all(updatePromises)).pipe(
          map(() => {
            console.log(
              `Aggiornati ${updatePromises.length} documenti con il nuovo locatore ID`
            );
          })
        );
      }),
      catchError((error) => {
        console.error("Errore durante l'aggiornamento delle case:", error);
        return throwError(
          () => new Error("Errore durante l'aggiornamento delle case")
        );
      })
    );
  }

  /**Metodo per aggiungere una tipologia di casa */
  addTipologia(newElement: string) {
    if (newElement.trim() !== '' && !this.tipologie.includes(newElement)) {
      // Aggiunge l'elemento all'array
      this.tipologie.push(newElement);
      // Salva gli elementi aggiornati nel local storage
      localStorage.setItem('tipologie', JSON.stringify(this.tipologie));
      // Resetta il campo di input
      newElement = '';
    }
  }

  /**Metodo per eliminare una tipologia di casa */
  deleteTipologia(elementSelected: string) {
    if (elementSelected) {
      const index = this.tipologie.indexOf(elementSelected);
      // Se l'elemento esiste nell'array
      if (index !== -1) {
        // Rimuove l'elemento dall'array
        this.tipologie.splice(index, 1);
        // Sovrascrive l'array aggiornato nel Local Storage
        localStorage.setItem('tipologie', JSON.stringify(this.tipologie));
      }
      // Resetta l'elemento selezionato
      elementSelected = '';
    }
  }
}
