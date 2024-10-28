import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AngularMaterialModule } from '../../../material-module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {
  CaseService,
  LoaderSpinnerService,
  PanelService,
} from '../../../../services';
import {
  RESULT_CONSTANT,
  INPUT_CONSTANT,
  TABLE_COLUMNS,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
  BUTTON_CONSTANT,
  LABEL_CONSTANT,
  ICON_CONSTANT,
  TABLE_INPUT_CONSTANT,
} from '../../../../constants';
import { GenericDropDownMenuComponent } from '../../../../shared/generics/generic-drop-down-menu/generic-drop-down-menu.component';
import {
  DettaglioCasaComponent,
  GenericConfirmModalComponent,
  GenericDetailModalComponent,
  GenericFeedbackModalComponent,
  GenericStepperModal,
} from '../../../../shared';
import { StepInformazioniComponent } from '../../../../shared/form-crea-casa/step-informazioni/step-informazioni.component';
import { StepCaratteristicheComponent } from '../../../../shared/form-crea-casa/step-caratteristiche/step-caratteristiche.component';
import { StepCostiComponent } from '../../../../shared/form-crea-casa/step-costi/step-costi.component';
import { StepRiepilogoComponent } from '../../../../shared/form-crea-casa/step-riepilogo/step-riepilogo.component';
import { HeaderCasaComponent } from '../../../../shared/header-casa/header-casa.component';
import { CustomValidator } from '../../../../utils';

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
  /** Constante per le label */
  labelConstant = LABEL_CONSTANT;
  /** Constante per le icone */
  iconConstant = ICON_CONSTANT;
  /** Header colonne tabella */
  headerColumn = TABLE_INPUT_CONSTANT;
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
      label: 'Assegna casa',
      icon: 'login',
      actionFunction: (r: any) => this.assegnaCasa(r.id),
    },
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
   * @param {PanelService} panelService L'injectable del service pannello
   * @param {MatDialog} dialog L'injectable del token
   * @param {FormBuilder} fb L'injectable del FormBuilder
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private caseService: CaseService,
    private loaderSpinnerService: LoaderSpinnerService,
    private panelService: PanelService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {}

  /** Lifecycle hook dell'onInit */
  ngOnInit() {
    this.caseService.getAllCase().subscribe({
      next: (caseList) => {
        // Assegna i dati alla tabella
        this.dataSource.data = caseList;
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

  /** Lifecycle hook del AfterViewInit */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**Metodo per associare una casa ad uno o più inquilini */
  assegnaCasa(id: string) {
    this.loaderSpinnerService.show();
    this.caseService.getCasa(id).subscribe({
      next: (res) => {
        this.loaderSpinnerService.hide();
        const obj = res._document.data.value.mapValue.fields;
        console.log(obj, 'obj');

        this.caseService.dettaglioCasa = obj;

        this.router.navigateByUrl('/bo/assegna-casa');
      },
    });
  }

  /**Metodo per visualizzare il dettaglio della casa */
  dettaglioCasa(id: string) {
    this.loaderSpinnerService.show();
    this.caseService.getCasa(id).subscribe({
      next: (res) => {
        const obj = res._document.data.value.mapValue.fields;
        this.caseService.dettaglioCasa = obj;
        this.loaderSpinnerService.hide();
        this.panelService.open(GenericDetailModalComponent, {
          backdropClass: 'custom-backdrop',
          panelClass: 'custom-panel',
          type: 'panel',
          headComponent: HeaderCasaComponent,
          components: [DettaglioCasaComponent],
        });
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
                id: [objCasa.locatore.id],
                displayName: [objCasa.locatore.displayName],
                phoneNumber: [objCasa.locatore.phoneNumber],
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
            this.dataSource._updateChangeSubscription();
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

  /** Funzione che restituisce la classe CSS in base allo stato */
  getStatusClass(statoAffitto: string) {
    switch (statoAffitto) {
      case 'LIBERO':
        return 'chip-green';
      case 'IN SCADENZA':
        return 'chip-orange';
      case 'OCCUPATO':
        return 'chip-red';
      default:
        return '';
    }
  }

  /**Funzione che restituisce l'icona in base allo stato */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'LIBERO':
        return this.iconConstant.done;
      case 'IN SCADENZA':
        return this.iconConstant.warning;
      case 'OCCUPATO':
        return this.iconConstant.block;
      default:
        return '';
    }
  }

  /** Funzione che restituisce la classe CSS in base allo stato */
  getStatusClassManutenzione(statoManutenzione: string) {
    switch (statoManutenzione) {
      case 'BUONO':
        return 'chip-orange';
      case 'DA RISTRUTTURARE':
        return 'chip-red';
      case 'NUOVO':
        return 'chip-green';
      default:
        return '';
    }
  }

  /**Funzione che restituisce l'icona in base allo stato */
  getStatusIconManutenzione(status: string): string {
    switch (status) {
      case 'BUONO':
        return this.iconConstant.emergency_home;
      case 'DA RISTRUTTURARE':
        return this.iconConstant.construction;
      case 'NUOVO':
        return this.iconConstant.energy_savings_leaf;
      default:
        return '';
    }
  }
}
