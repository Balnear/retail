import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../shared/custom-snackbar/custom-snackbar.component';

/** Una classe per il service Notifcation */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /**
   * Il costruttore del service
   * @param {MatSnackBar} snackBar L'injectable del service MatSnackBar
   */
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Mostra la notifica nella snackbar
   *
   * @param {string} message il messaggio da visualizzare nella snackbar
   * @param {number} duration la durata della visualizzazione della snackbar
   * @param {string} severity la severità dell'errore, valori possibili: 'error' | 'warning' | 'success'
   */
  show(
    message: string,
    duration: number = -1,
    severity: 'error' | 'warning' | 'success'
  ) {
    const snackBar = this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message: message, severity: severity, snackBar: this.snackBar },
      duration: duration,
      horizontalPosition: 'left',
      panelClass: ['custom-snackbar', 'snack-' + severity],
    });
    snackBar.onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }
}
