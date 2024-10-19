import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AngularMaterialModule } from '../../../material-module';
import { LoaderSpinnerService } from '../../../../services';
import {
  RESULT_CONSTANT,
  INPUT_CONSTANT,
  TABLE_COLUMNS,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
  BUTTON_CONSTANT,
} from '../../../../constants';
import { GenericDropDownMenuComponent } from '../../../../shared/generics/generic-drop-down-menu/generic-drop-down-menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CaseService } from '../../../../services/case.service';
import {
  GenericConfirmModalComponent,
  GenericFeedbackModalComponent,
  GenericStepperModal,
} from '../../../../shared';
import { MatDialog } from '@angular/material/dialog';
import { StepInformazioniComponent } from '../../../../shared/form-crea-casa/step-informazioni/step-informazioni.component';
import { StepCaratteristicheComponent } from '../../../../shared/form-crea-casa/step-caratteristiche/step-caratteristiche.component';
import { StepCostiComponent } from '../../../../shared/form-crea-casa/step-costi/step-costi.component';
import { StepRiepilogoComponent } from '../../../../shared/form-crea-casa/step-riepilogo/step-riepilogo.component';

/** Componente per la lista delle case */
@Component({
  selector: 'app-lista-case',
  standalone: true,
  templateUrl: './lista-case.component.html',
  styleUrls: ['./lista-case.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    GenericDropDownMenuComponent,
  ],
})
export default class ListaCaseComponent {
  /** Costante per il risultato vuoto della tabella */
  resultConstant = RESULT_CONSTANT;
  /** Constante per l'input della ricera */
  inputConstant = INPUT_CONSTANT;
  /** Riferimento al matDialog */
  dialogRef: any;
  /** La lista delle colonne da visualizzare*/
  displayedColumns = TABLE_COLUMNS.case;
  /** DataSource per MatTable */
  dataSource = new MatTableDataSource<any>();
  /** Gestione del errore */
  errore: string | null = null;
  /** Indica il paginator della tabella*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  /** Indica il filtraggio per colonna*/
  @ViewChild(MatSort) sort!: MatSort;
  /** Le actions della dropdown */
  actions: any[] = [
    {
      label: 'Dettaglio',
      icon: 'visibility',
      actionFunction: (r: any) => this.dettaglioCasa(r.id),
    },
    {
      label: 'Modifica',
      icon: 'edit',
      actionFunction: (r: any) => this.modificaCasa(r.id),
    },
    {
      label: 'Elimina',
      icon: 'delete',
      actionFunction: (r: any) => this.eliminaCasa(r.id),
    },
  ];

  /**
   * Il costruttore della classe, si popola la variabile listaCase con la lista delle case instanziata nel resolver
   * @param {CaseService} caseService L'injectable del service CaseService
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {ActivatedRoute} activatedRoute Fornisce accesso alle informazioni sulla rotta associata a questa componente
   */
  constructor(
    private caseService: CaseService,
    private loaderSpinnerService: LoaderSpinnerService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.caseService.getAllCase().subscribe({
      next: (caseList) => {
        this.dataSource.data = caseList; // Assegna i dati alla tabella
        this.onCasaAdded(caseList);
      },
      error: (err) => {
        this.errore = 'Errore nel recupero delle case: ' + err.message;
      },
    });
  }

  /**Metodo per applicare il filtro alla tabella */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**Metodo per visualizzare il dettaglio della casa */
  dettaglioCasa(id: string) {
    this.caseService.getCasa(id).subscribe({
      next: (res) => {
        console.log('entro');
        console.log(res.id, 'res');
      },
    });
  }

  /**Metodo per modificare una casa */
  modificaCasa(id: string) {
    this.loaderSpinnerService.show();
    this.caseService.getCasa(id).subscribe({
      next: (casa) => {
        this.loaderSpinnerService.hide();
        const objCasa = casa._document.data.value.mapValue.fields;
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
              indirizzo: [objCasa.indirizzo.stringValue, Validators.required],
              citta: [objCasa.citta.stringValue, Validators.required],
              codicePostale: [
                objCasa.codicePostale.stringValue,
                Validators.required,
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
              arredamento: [
                objCasa.arredamento.booleanValue,
                Validators.required,
              ],
              docuumentoArredamento: [objCasa.documentoArredamento],
              assegnaCasa: [objCasa.assegnaCasa],
              locatore: this.fb.group({
                id: [objCasa.locatore.id],
                displayName: [objCasa.locatore.displayName],
                phoneNumber: [objCasa.locatore.phoneNumber],
              }),
              caratteristiche: this.fb.group({
                dimensione: [
                  objCaratteristiche.dimensione.integerValue,
                  Validators.required,
                ],
                camere: [
                  objCaratteristiche.camere.integerValue,
                  Validators.required,
                ],
                bagni: [
                  objCaratteristiche.bagni.integerValue,
                  Validators.required,
                ],
                piano: [
                  objCaratteristiche.piano.stringValue,
                  Validators.required,
                ],
                giardino: [
                  objCaratteristiche.giardino.booleanValue,
                  Validators.required,
                ],
                postoAuto: [
                  objCaratteristiche.postoAuto.booleanValue,
                  Validators.required,
                ],
                ariaCondizionata: [
                  objCaratteristiche.ariaCondizionata.booleanValue,
                  Validators.required,
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
            this.dataSource._updateChangeSubscription();
          });
      },
      error: () => {
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
              // Aggiorna i dati nel dataSource
              this.dataSource.data = this.dataSource.data.filter(
                (casa) => casa.id !== id
              );
              this.dataSource.paginator = this.paginator;
              this.loaderSpinnerService.hide();
              this.dialog
                .open(
                  GenericFeedbackModalComponent,
                  GENERIC_FEEDBACK.eliminazione_casa_effettuata
                )
                .afterClosed()
                .subscribe(() => this.dataSource._updateChangeSubscription());
            },
            error: () => this.loaderSpinnerService.hide(),
          });
        }
      });
  }

  /**Metodo che viene chiamato quando si aggiunge una casa */
  onCasaAdded(newCasa: any) {
    // Aggiungi la nuova casa ai dati della tabella
    this.dataSource.data = [...this.dataSource.data, newCasa];
  }
}
