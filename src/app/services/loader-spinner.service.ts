import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** L'injectable del service loader-spinner service*/
@Injectable({
  providedIn: 'root',
})
export class LoaderSpinnerService {
  /** Subject per la visualizzazione dello spinner */
  private showSpinnerSubject = new Subject<boolean>();

  /** Subject per la visualizzazione dell'animazione Login */
  private showLoggedInSubject = new Subject<boolean>();

  /** Il costruttore della classe.*/
  constructor() {}

  /**Visualizza Loader-Spinner */
  show() {
    this.showSpinnerSubject.next(true);
  }

  /**Visualizza Animazione Login */
  showLog() {
    this.showLoggedInSubject.next(true);
  }

  /**Nasconde Loader-Spinner */
  hide() {
    this.showSpinnerSubject.next(false);
  }

  /**Nasconde Animazione Login */
  hideLog() {
    this.showLoggedInSubject.next(false);
  }

  /**
   * Ritorna un Observable di tipo boolean per l'evento di mostra/nascondi loader spinner
   *
   * @returns {Observable<boolean>}
   */
  isVisible(): Observable<boolean> {
    return this.showSpinnerSubject.pipe();
  }

  /**
   * Ritorna un Observable di tipo boolean per l'evento di mostra/nascondi animazione login
   *
   * @returns {Observable<boolean>}
   */
  isVisibleLog(): Observable<boolean> {
    return this.showLoggedInSubject.pipe();
  }
}
