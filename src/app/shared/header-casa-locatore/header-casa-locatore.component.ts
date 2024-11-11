import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AngularMaterialModule } from '../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import { CaseService, LoaderSpinnerService } from '../../services';
import { CustomDialogService } from '../../services/dialog.service';
import {
  LABEL_CONSTANT,
  ICON_CONSTANT,
  BUTTON_CONSTANT,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
} from '../../constants';
import { CustomValidator } from '../../utils';
import { StepCaratteristicheComponent } from '../form-crea-casa/step-caratteristiche/step-caratteristiche.component';
import { StepCostiComponent } from '../form-crea-casa/step-costi/step-costi.component';
import { StepInformazioniComponent } from '../form-crea-casa/step-informazioni/step-informazioni.component';
import { StepRiepilogoComponent } from '../form-crea-casa/step-riepilogo/step-riepilogo.component';
import {
  GenericDetailModalComponent,
  GenericStepperModal,
  GenericConfirmModalComponent,
  GenericFeedbackModalComponent,
} from '../generics';

/**Componente header per il dettaglio della casa associata al locatore */
@Component({
  selector: 'app-header-casa-locatore',
  standalone: true,
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header-casa-locatore.component.html',
  styleUrls: ['./header-casa-locatore.component.scss'],
})
export class HeaderCasaLocatoreComponent {
  /**costanti per la visualizzazione */
  labelCostant = LABEL_CONSTANT;
  /**costanti per le icone */
  iconCostant = ICON_CONSTANT;
  /** I dati della casa */
  data!: any;
  /** Variabile d'appoggio della casa */
  casa!: any;
  /** Riferimento al matDialog */
  dialogRef: any;
  /**modifica dello stato */
  editStatus: boolean = false;

  /**
   * Il construttore della classe
   * @param {CaseService} caseService - Injectable del service CaseService per gestire le operazioni sulle case.
   * @param {CustomDialogService} customDialogService Service customDialogService
   * @param {LoaderSpinnerService } loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {GenericDetailModalComponent} genericDetailModalComponent La chiamata alla componente modale dettaglio
   * @param {MatDialog} dialog Injectable del service MatDialog
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private caseService: CaseService,
    private customDialogService: CustomDialogService,
    private loaderSpinnerService: LoaderSpinnerService,
    private genericDetailModalComponent: GenericDetailModalComponent,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.data = this.caseService.dettaglioCasa;
    this.casa = this.data._document.data.value.mapValue.fields;
  }

  /**Funzione per la chiusura della dialog */
  closeDialog() {
    this.genericDetailModalComponent.closeDialog();
  }

  /**Metodo per modificare una casa */
  modificaCasa(id: string) {
    this.loaderSpinnerService.show();
    this.caseService.getCasa(id).subscribe({
      next: (casa) => {
        this.loaderSpinnerService.hide();
        const objCasa = casa._document.data.value.mapValue.fields;
        const objLocatore = objCasa.locatore.mapValue.fields;
        const objCaratteristiche =
          casa._document.data.value.mapValue.fields.caratteristiche.mapValue
            .fields;
        const objCosti =
          casa._document.data.value.mapValue.fields.costi.mapValue.fields;
        this.dialogRef = this.dialog.open(GenericStepperModal, {
          width: '824px',
          height: '864px',
          autoFocus: false,
          disableClose: true,
          data: {
            form: this.fb.group({
              id: [casa.id],
              nome: [objCasa.nome.stringValue, Validators.required],
              tipologiaCasa: [
                objCasa.tipologiaCasa.stringValue,
                Validators.required,
              ],
              indirizzo: [
                objCasa.indirizzo.stringValue,
                [Validators.required, CustomValidator.commaNumberValidator()],
              ],
              citta: [objCasa.citta.stringValue, Validators.required],
              codicePostale: [
                objCasa.codicePostale.stringValue,
                [Validators.required, CustomValidator.fiveDigitsValidator()],
              ],
              statoAffitto: [
                objCasa.statoAffitto.stringValue,
                Validators.required,
              ],
              statoManutenzione: [
                objCasa.statoManutenzione.stringValue,
                Validators.required,
              ],
              dataInserimento: [
                objCasa.dataInserimento.timestampValue,
                Validators.required,
              ],
              arredamento: [objCasa.arredamento.booleanValue],
              documentoArredamento: [objCasa.documentoArredamento.stringValue],
              //TODO: VERIFICARE COME INSERIRE QUESTO
              // assegnaCasa: [objCasa.assegnaCasa],
              locatore: this.fb.group({
                id: [objLocatore.id.stringValue],
                displayName: [objLocatore.displayName.stringValue],
                phoneNumber: [objLocatore.phoneNumber.stringValue],
              }),
              caratteristiche: this.fb.group({
                dimensione: [
                  objCaratteristiche.dimensione.stringValue,
                  Validators.required,
                ],
                camere: [
                  objCaratteristiche.camere.stringValue,
                  Validators.required,
                ],
                bagni: [
                  objCaratteristiche.bagni.stringValue,
                  Validators.required,
                ],
                piano: [
                  objCaratteristiche.piano.stringValue,
                  Validators.required,
                ],
                giardino: [objCaratteristiche.giardino.booleanValue],
                postoAuto: [objCaratteristiche.postoAuto.booleanValue],
                ariaCondizionata: [
                  objCaratteristiche.ariaCondizionata.booleanValue,
                ],
                tipoRiscaldamento: [
                  objCaratteristiche.tipoRiscaldamento.stringValue,
                  Validators.required,
                ],
              }),
              costi: this.fb.group({
                importoAffittoMensile: [
                  objCosti.importoAffittoMensile.stringValue,
                  Validators.required,
                ],
                metodoPagamento: [
                  objCosti.metodoPagamento.stringValue,
                  Validators.required,
                ],
              }),
            }),
            components: [
              StepInformazioniComponent,
              StepCaratteristicheComponent,
              StepCostiComponent,
              StepRiepilogoComponent,
            ],
            stepsList: [
              'Informazioni',
              'Caratteristiche',
              'Costi',
              'Riepilogo',
            ],
            headerLabels: {
              title: 'Modifica Casa',
              subtitle: 'Modifica i dati relativi alla casa.',
            },
            callback: (form: any) => this.submitForm(form),
            submitFormText: BUTTON_CONSTANT.modifica_casa,
          },
        });
        this.dialogRef.backdropClick().subscribe(() => {
          this.dialog
            .open(
              GenericConfirmModalComponent,
              GENERIC_CONFIRM.sicuro_di_uscire
            )
            .afterClosed()
            .subscribe((res) => {
              if (res) {
                this.dialogRef.close();
              }
            });
        });
      },
      error: (err) => {
        console.log(err, 'error');
      },
    });
  }
  submitForm(form: any) {
    this.loaderSpinnerService.show();
    const obj = form.value;
    this.caseService.modificaCasa(obj.id, obj).subscribe({
      next: () => {
        this.dialogRef.close();

        this.loaderSpinnerService.hide();
        this.dialog
          .open(
            GenericFeedbackModalComponent,
            GENERIC_FEEDBACK.modifiche_salvate
          )
          .afterClosed()
          .subscribe(() => {
            this.closeDialog();
          });
      },
      error: (err) => {
        console.log(err, 'errore modifica');
        this.loaderSpinnerService.hide();
      },
    });
  }

  /**Metodo per eliminare una casa */
  eliminaCasa(id: string) {
    this.dialog
      .open(GenericConfirmModalComponent, GENERIC_CONFIRM.elimina_casa)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.loaderSpinnerService.show();
          this.caseService.eliminaCasa(id).subscribe({
            next: () => {
              this.loaderSpinnerService.hide();
              this.closeDialog();
              this.dialog
                .open(
                  GenericFeedbackModalComponent,
                  GENERIC_FEEDBACK.eliminazione_casa_effettuata
                )
                .afterClosed()
                .subscribe(() => {
                  this.closeDialog();
                });
            },
            error: () => this.loaderSpinnerService.hide(),
          });
        }
      });
  }
}
