import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

import { Casa } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private firestore: Firestore) {}

  /**
   * Funzione per creare una nuova casa
   * @param {Casa} payload Il payload della chiamata
   * @returns {Observable<any>}
   */
  creaCasa(payload: Casa): Observable<any> {
    const colRef = collection(this.firestore, 'case'); // Assicurati che 'case' sia il nome della tua collezione
    return from(addDoc(colRef, payload));
  }
}
