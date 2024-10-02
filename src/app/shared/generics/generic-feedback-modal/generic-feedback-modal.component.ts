import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BUTTON_CONSTANT } from '../../../constants';
import { SimpleModalModel } from '../../../models';
import { AngularMaterialModule } from '../../../modules/material-module';



/** Una classe per la modale di feedback generico */
@Component({
  standalone: true,
  selector: 'app-generic-feedback-modal',
  templateUrl: './generic-feedback-modal.component.html',
  styleUrls: ['./generic-feedback-modal.component.scss'],
  imports: [CommonModule, AngularMaterialModule],
})
export class GenericFeedbackModalComponent {
  /** Costante delle label dei button */
  buttonConstant = BUTTON_CONSTANT;

  /**
   * Il costruttore della classe.
   * @param {MatDialogRef<GenericFeedbackModalComponent>} dialog il riferimento alla modale
   * @param {SimpleModalModel} data Oggetto dei dati per la modale
   */
  constructor(
    private dialog: MatDialogRef<GenericFeedbackModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleModalModel
  ) {
    if (this.data.autoCloseTime && this.data.autoCloseTime > 0) {
      setTimeout(() => {
        this.dialog.close();
      }, this.data.autoCloseTime);
    }
  }

  /** Chiude la modale senza azione */
  closeDialog() {
    this.dialog.close(false);
  }

  /** Chiude la modale confermando l'azione */
  confirmAction() {
    this.dialog.close(true);
  }
}

/*
  ------SOSPENSIONE EFFETTUATA------

  this.matDialog.open(GenericFeedbackModalComponent, {
    width: '624px',
    height: '220px',
    autoFocus: false,
    data: {
      titolo: LABEL_CONSTANT.sospensione_effettuata,
      subtitle: LABEL_CONSTANT.sospensione_effettuata_subtitle,
      icona: 'block', // 'block' || 'delete' || 'check'
      tipo: 'circle',
      status: 'warn', // 'warn' || 'success' || 'error'
      dimension: 'sm', // 'sm' || 'lg'
    },
  });

  ------ELIMINAZIONE EFFETTUATA------

  this.matDialog.open(GenericFeedbackModalComponent, {
    width: '624px',
    height: '220px',
    autoFocus: false,
    data: {
      titolo: LABEL_CONSTANT.eliminazione_effettuata,
      subtitle: LABEL_CONSTANT.eliminazione_effettuata_subtitle,
      icona: 'delete',
      tipo: 'circle',
      status: 'error',
      dimension: 'sm',
    },
  });

  ------RIABILITAZIONE EFFETTUATA------

  this.matDialog.open(GenericFeedbackModalComponent, {
    width: '624px',
    height: '220px',
    autoFocus: false,
    data: {
      titolo: LABEL_CONSTANT.riabilitazione_effettuata,
      subtitle: LABEL_CONSTANT.riabilitazione_effettuata_subtitle,
      icona: 'check',
      tipo: 'circle',
      status: 'success',
      dimension: 'sm',
    },
  });

  ------SALVATAGGIO MODIFICHE------

  this.matDialog.open(GenericFeedbackModalComponent, {
    width: '624px',
    height: '220px',
    autoFocus: false,
    data: {
      titolo: LABEL_CONSTANT.salvataggio_modifiche,
      subtitle: LABEL_CONSTANT.modifiche_salvate_correttamente,
      icona: 'check',
      tipo: 'circle',
      status: 'success',
      dimension: 'sm',
    },
  });
*/
