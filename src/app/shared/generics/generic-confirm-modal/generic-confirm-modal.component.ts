import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_CONSTANT } from '../../../constants';
import { ConfirmData } from '../../../models';
import { AngularMaterialModule } from '../../../modules/material-module';



/** Una classe per la modale di conferma generica */
@Component({
  standalone: true,
  selector: 'app-generic-confirm-modal',
  templateUrl: './generic-confirm-modal.component.html',
  styleUrls: ['./generic-confirm-modal.component.scss'],
  imports: [CommonModule, AngularMaterialModule],
})
export class GenericConfirmModalComponent {
  /** Costante delle label dei button */
  buttonConstant = BUTTON_CONSTANT;

  /**
   * Il costruttore della classe.
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   * @param {MatDialogRef<GenericConfirmModalComponent>} dialog il riferimento alla modale
   * @param {ConfirmData} data Oggetto dei dati per la modale
   */
  constructor(
    private router: Router,
    private dialog: MatDialogRef<GenericConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmData
  ) {}

  /** Chiude la modale senza azione */
  closeDialog() {
    this.dialog.close(false);
  }

  /** Chiude la modale confermando l'azione */
  confirmAction() {
    this.dialog.close(true);
    if (this.data.redirect) this.router.navigate([this.data.redirect]);
  }
}
