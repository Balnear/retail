import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';

/** Service per la tabella generica */
@Injectable({
  providedIn: 'root',
})
export class GenericTableService {
  /** Subject per la selezione di tutte le righe */
  private checkAll: Subject<any> = new Subject<any>();
  /** Subject per lo stato del filtraggio/ricerca sulla tabella */
  private emitFilteringStatusEvent: Subject<boolean> = new Subject<boolean>();
  /** Subject per l'evento di distruzione tabella */
  private tableDestroy: Subject<void> = new Subject<void>();
  /** Subject per l'evento di filtraggio tabella */
  private filterEvent: Subject<string> = new Subject<string>();

  /** Numero tabelle aperte */
  numeroTabelle: number = 0;
  /**Reset dei filtri */
  resetFilter: boolean = false;
  /**
   * Emette evento cambio stato filtraggio/ricerca
   * @param {boolean} status lo stato del filtraggio/ricerca
   */
  emitFilteringStatus(status: boolean): void {
    this.emitFilteringStatusEvent.next(status);
  }

  /**
   * Ritorna un Observable per l'evento di update stato filtraggio/ricerca
   * @returns {Observable<boolean>}
   */
  filteringStatusEventListener(): Observable<boolean> {
    return this.emitFilteringStatusEvent.pipe();
  }

  /** Emette evento distruzione tabella */
  emitTableDestroy(): void {
    this.tableDestroy.next();
  }

  /** Ritorna un Observable per l'evento di distruzione tabella */
  tableDestroyListener(): Observable<void> {
    return this.tableDestroy.pipe();
  }

  /**
   * Emette evento selezione/deselezione di tutte le righe
   * @param {any} obj seleziona o deseleziona tutte le righe
   */
  emitCheckAll(obj: any): void {
    this.checkAll.next(obj);
  }

  /**
   * Ritorna un Observable per l'evento di selezione/deselezione delle righe
   * @returns {Observable<any>}
   */
  checkAllListener(): Observable<any> {
    return this.checkAll.pipe();
  }

  emitFiterEvent(filterFrom: string): void {
    this.filterEvent.next(filterFrom);
  }
  emitFiterListener(): Observable<string> {
    return this.filterEvent.pipe();
  }
}
