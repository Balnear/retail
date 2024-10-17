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
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

import { Casa } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
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
  
}
