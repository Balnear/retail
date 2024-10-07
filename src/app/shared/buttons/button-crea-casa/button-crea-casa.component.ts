import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { LoaderSpinnerService } from '../../../services';
import { CustomDialogService } from '../../../services/dialog.service';
import { BUTTON_CONSTANT } from '../../../constants';

/**Componente ButtonCreaCasa */
@Component({
  selector: 'app-button-crea-casa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-crea-casa.component.html',
  styleUrl: './button-crea-casa.component.scss',
})
export class ButtonCreaCasaComponent {
  /**Costante button */
  button_constant = BUTTON_CONSTANT;
  /**DialogRef riferimento al dialog*/
  dialogRef: any;

  /**
   * Il costruttore della classe ButtonCreaCaseComponent
   * @param {LoaderSpinnerService} loaderSpinnerService  Service loaderSpinnerService
   * @param {CaseService} caseService  Service caseService
   * @param {CustomDialogService} customDialogService Service customDialogService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    // private caseService: CaseService,
    private customDialogService: CustomDialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  /**Apertura del panel per la creazione gestore */
  openDialog() {
    // this.dialogRef = this.dialog.open(GenericFormModalComponent, {
    //   width: '824px',
    //   height: '864px',
    //   disableClose: true,
    //   autoFocus: false,
    //   data: {
    //     form: this.fb.group({
    //       anagrafica: this.fb.group({
    //         nome: [
    //           '',
    //           Validators.required,
    //           Validators.pattern(/^[a-zA-Z]{1,40}$/),
    //         ],
    //         cognome: [
    //           '',
    //           [Validators.required, Validators.pattern(/^[a-zA-Z]{1,40}$/)],
    //         ],
    //         telefono: [
    //           '',
    //           [
    //             Validators.required,
    //             Validators.minLength(10),
    //             Validators.maxLength(15),
    //             Validators.pattern('[0-9 +]*'),
    //           ],
    //         ],
    //         email: [
    //           '',
    //           [
    //             Validators.required,
    //             Validators.pattern(
    //               /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    //             ),
    //           ],
    //         ],
    //       }),
    //       ruolo: ['', [Validators.required]],
    //     }),
    //     submitFormText: BUTTON_CONSTANT.aggiungi,
    //     headerLabels: {
    //       title: LABEL_CONSTANT.aggiungi_gestore,
    //       subtitle: LABEL_CONSTANT.inserisci_dati,
    //     },
    //     component: FormCreazioneGestoreComponent,
    //     callback: (form: Gestore) => this.submitForm(form),
    //   },
    // });
    // this.dialogRef.backdropClick().subscribe(() => {
    //   this.customDialogService.closeDialog();
    // });
  }

  /** Chiude la modale */
  closeModal() {
    this.dialogRef.close();
  }
  /** submitForm creazione gestore ed aggiornamento lista gestori */
  submitForm(form: any) {
    // this.loaderSpinnerService.show();
    // this.gestoriService.creaGestore(form.value).subscribe({
    //   next: () => {
    //     this.loaderSpinnerService.hide();
    //     this.closeModal();
    //     this.dialog
    //       .open(GenericFeedbackModalComponent, GENERIC_FEEDBACK.crea_gestore)
    //       .afterClosed()
    //       .subscribe(() => {
    //         this.gestoriService.emitUpdateListaGestori();
    //       });
    //   },
    //   error: () => this.loaderSpinnerService.hide(),
    // });
  }
}
