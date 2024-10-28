import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

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

  /**Metodo per ottenere tutti i documenti della collezione "case" */
  getAllCase(): Observable<any[]> {
    const caseCollectionRef = collection(this.firestore, 'case');
    return collectionData(caseCollectionRef, { idField: 'id' });
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
