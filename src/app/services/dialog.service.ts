import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { GENERIC_CONFIRM } from '../constants';
import { GenericConfirmModalComponent } from '../shared/generics';

/** L'injectable del service dialog service */
@Injectable({
  providedIn: 'root',
})
export class CustomDialogService {
  /**  Booleana per il controllo se il form è stato valorizzato */
  hasFormValues: boolean = false;

  /**
   * Il costruttore della classe
   * @param {MatDialog} dialog L'injectable del service MatDialog
   */
  constructor(private dialog: MatDialog) {}


  /** Funzione per la chiusura del dialog, fa apparire la modale di conferma nel caso del form valorizzato */
  closeDialog() {
    if (this.hasFormValues) {
      const dialogRef = this.dialog.open(
        GenericConfirmModalComponent,
        GENERIC_CONFIRM.sicuro_di_uscire
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialog.closeAll();
        }
      });
    } else this.dialog.closeAll()

  }
}
