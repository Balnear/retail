import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { LoaderSpinnerService } from '../../../services';
import {
  BUTTON_CONSTANT,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
} from '../../../constants';
import {
  GenericConfirmModalComponent,
  GenericFeedbackModalComponent,
  GenericStepperModal,
} from '../../generics';
import { CaseService } from '../../../services/case.service';
import { StepCaratteristicheComponent } from '../../form-crea-casa/step-caratteristiche/step-caratteristiche.component';
import { StepCostiComponent } from '../../form-crea-casa/step-costi/step-costi.component';
import { StepInformazioniComponent } from '../../form-crea-casa/step-informazioni/step-informazioni.component';
import { StepRiepilogoComponent } from '../../form-crea-casa/step-riepilogo/step-riepilogo.component';

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
  /** Contiene il form */
  form!: FormGroup;

  /**
   * Il costruttore della classe ButtonCreaCaseComponent
   * @param {LoaderSpinnerService} loaderSpinnerService  Service loaderSpinnerService
   * @param {CaseService} caseService  Service caseService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    private caseService: CaseService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nome: [],
      indirizzo: [],
      citta: [],
      codicePostale: [],
      statoAffitto: [],
      statoManutenzione: [],
      dataInserimento: [],
      arredamento: [false],
      documentoArredamento: [],
      assegnaCasa: [],
      locatore: this.fb.group({
        id: [],
        displayName: [],
        phoneNumber: [],
      }),
      caratteristiche: this.fb.group({
        dimensione: [],
        camere: [],
        bagni: [],
        piano: [],
        giardino: [false],
        postoAuto: [false],
        ariaCondizionata: [false],
        tipoRiscaldamento: [],
      }),
      costi: this.fb.group({
        importoAffittoMensile: [],
        // dataInizioContratto: [],
        // dataFineContratto: [],
        // durataContratto: [],
        // importoContratto: [],
        metodoPagamento: [],
      }),
    });
  }

  /**Apertura del panel per la creazione gestore */
  openDialog() {
    this.dialogRef = this.dialog.open(GenericStepperModal, {
      width: '824px',
      height: '864px',
      autoFocus: false,
      disableClose: true,
      data: {
        form: this.form,
        formValidators: [
          // {
          //   validators: [
          //     {
          //       field: 'locatore.id',
          //       validators: Validators.required,
          //     },
          //     {
          //       field: 'locatore.displayName',
          //       validators: Validators.required,
          //     },
          //     {
          //       field: 'locatore.phoneNumber',
          //       validators: Validators.required,
          //     },
          //   ],
          // },

          {
            validators: [
              /**Informazioni generali */
              {
                field: 'nome',
                validators: Validators.required,
              },
              {
                field: 'indirizzo',
                validators: Validators.required,
              },
              {
                field: 'citta',
                validators: Validators.required,
              },
              {
                field: 'codicePostale',
                validators: Validators.required,
              },
              {
                field: 'statoAffitto',
                validators: Validators.required,
              },
              {
                field: 'statoManutenzione',
                validators: Validators.required,
              },
              {
                field: 'dataInserimento',
                validators: Validators.required,
              },
              {
                field: 'arredamento',
                validators: Validators.required,
              },
            ],
          },
          {
            validators: [
              /**Caratteristiche */
              {
                field: 'caratteristiche.dimensione',
                validators: Validators.required,
              },
              {
                field: 'caratteristiche.camere',
                validators: Validators.required,
              },
              {
                field: 'caratteristiche.bagni',
                validators: Validators.required,
              },
              {
                field: 'caratteristiche.piano',
                validators: Validators.required,
              },
              {
                field: 'caratteristiche.giardino',
                validators: Validators.required,
              },
              {
                field: 'caratteristiche.postoAuto',
                validators: Validators.required,
              },
              {
                field: 'caratteristiche.ariaCondizionata',
                validators: Validators.required,
              },
              {
                field: 'caratteristiche.tipoRiscaldamento',
                validators: Validators.required,
              },
            ],
          },
          {
            validators: [
              /**Costi */
              {
                field: 'costi.importoAffittoMensile',
                validators: [Validators.required, Validators.pattern('^[0-9]*$')],
              },
              //TODO: ASSEGNAZIONE INQUILINO
              // {
              //   field: 'costi.dataInizioContratto',
              //   validators: Validators.required,
              // },
              // {
              //   field: 'costi.dataFineContratto',
              //   validators: Validators.required,
              // },
              // {
              //   field: 'costi.durataContratto',
              //   validators: Validators.required,
              // },
              // {
              //   field: 'costi.importoContratto',
              //   validators: Validators.required,
              // },
              {
                field: 'costi.metodoPagamento',
                validators: Validators.required,
              },
            ],
          },
        ],
        components: [
          StepInformazioniComponent,
          StepCaratteristicheComponent,
          StepCostiComponent,
          StepRiepilogoComponent,
        ],
        stepsList: ['Informazioni', 'Caratteristiche', 'Costi', 'Riepilogo'],
        headerLabels: {
          title: 'Crea Casa',
          subtitle: 'Inserisci i dati relativi alla casa.',
        },
        callback: () => this.submitForm(this.form),
        submitFormText: BUTTON_CONSTANT.aggiungi_casa,
      },
    });
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialog
        .open(GenericConfirmModalComponent, GENERIC_CONFIRM.sicuro_di_uscire)
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.dialogRef.close();
          }
        });
    });
  }

  /** Chiude la modale */
  closeModal() {
    this.dialogRef.close();
  }
  /** submitForm creazione case ed aggiornamento lista case */
  submitForm(form: any) {
    this.loaderSpinnerService.show();
    this.caseService.creaCasa(form.value).subscribe({
      next: (res) => {
        this.loaderSpinnerService.hide();
        this.closeModal();
        console.log(res, 'casa creata');
        this.dialog
          .open(GenericFeedbackModalComponent, GENERIC_FEEDBACK.crea_casa)
          .afterClosed()
          .subscribe(() => {
            //TODO
            // this.caseService.emitUpdateListaCase();
          });
      },
      error: (err) => {
        this.loaderSpinnerService.hide();
        console.log(err, 'errore');
      },
    });
  }
}
