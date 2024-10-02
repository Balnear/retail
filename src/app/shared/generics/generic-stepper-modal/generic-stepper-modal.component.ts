import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { FooterComponent } from './components/footer/footer.component';
import { GenericConfirmModalComponent } from '../generic-confirm-modal/generic-confirm-modal.component';
import { HeaderComponent } from './components/header/header.component';
import { BUTTON_CONSTANT, GENERIC_CONFIRM } from '../../../constants';
import { StepDirective } from '../../../directives';
import { AngularMaterialModule } from '../../../modules/material-module';
import { CustomDialogService } from '../../../services/dialog.service';

/** Una classe per il componente della modale del form generico con lo stepper  */
@Component({
  selector: 'app-generic-stepper-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    StepDirective,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './generic-stepper-modal.component.html',
  styleUrls: ['./generic-stepper-modal.component.scss'],
})
export class GenericStepperModal {
  /** Decoratore ViewChild per l'elemento con la direttiva dello stepper */
  @ViewChild(StepDirective, { static: true }) stepHost!: StepDirective;

  /** Testo del pulsante di submit del form */
  submitFormText: string = BUTTON_CONSTANT.salva_modifiche;
  /** FormGroup del form generico  */
  form!: FormGroup;
  /** Validators del form */
  formValidators!: any;
  /** Lista dei componenti da caricare nello stepper */
  components!: any;
  /** Lista degli step */
  stepsList!: string[];
  /** Label della testata */
  headerLabels!: any;
  /** Step corrente */
  currentStep: number = 0;
  /** Numero di step */
  stepsNumber!: number;
  /** Indica se la modale di conferma è già aperta */
  modalConfirmOpened: boolean = false;

  /**
   * Il costruttore della classe.
   * @param { CustomDialogService } customDialogService L'injectable del service CustomDialogService
   * @param { ChangeDetectorRef } changeDetectorRef L'injectable del ChangeDetectorRef
   * @param { MatDialog } dialog L'injectable del service per aprire la modale
   * @param { MatDialogRef<GenericStepperModal> } dialogRef il riferimento alla modale
   * @param { any } data Oggetto dei dati per la modale
   */
  constructor(
    public customDialogService: CustomDialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<GenericStepperModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * Lifecycle Hook dell'OnInit in cui si settano le informazioni ricevuto in fase di apertura modale.
   */
  ngOnInit(): void {
    this.form = this.data.form;
    this.components = this.data.components;
    this.stepsList = this.data.stepsList;
    this.headerLabels = this.data.headerLabels;
    this.stepsNumber = this.stepsList?.length;
    if (this.data.formValidators?.length) {
      this.formValidators = this.data.formValidators;
    }
    if (this.data.submitFormText) {
      this.submitFormText = this.data.submitFormText;
    }
    if (this.data.step) {
      this.changeStep(this.data.step);
    } else {
      this.changeStep();
    }
    this.form.valueChanges.subscribe(
      () => (this.customDialogService.hasFormValues = true)
    );
  }

  /**
   * Lifecycle Hook del AfterViewChecked in cui si fa il detect dei cambiamenti
   */
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * HostListener dell'evento di pressione esc sulla tastiera per chiedere conferma chiusura modale creazione esercizi.
   */
  @HostListener('window:keyup.esc') onKeyUp() {
    if (this.customDialogService.hasFormValues) {
      if (!this.modalConfirmOpened) {
        this.modalConfirmOpened = true;
        const dialogRef = this.dialog.open(
          GenericConfirmModalComponent,
          GENERIC_CONFIRM.sicuro_di_uscire
        );
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.form.reset();
            this.dialogRef.close();
          }
          this.modalConfirmOpened = false;
        });
      }
    } else this.dialog.closeAll();
  }

  /** Setta la variabile per il controllo dei dati inseriti nel form a false */
  ngOnDestroy() {
    this.form.reset();
    this.customDialogService.hasFormValues = false;
  }

  /**
   * Carica il componente al cambio dello step
   */
  loadComponent() {
    if (this.formValidators?.length) {
      this.setValidators();
    }
    const viewContainerRef = this.stepHost.viewContainerRef;
    viewContainerRef.clear();
    if (this.components?.length) {
      const componentRef = viewContainerRef.createComponent<any>(
        this.components[this.currentStep]
      );
    }
  }

  /** Imposta la validazione del Form per lo step corrente */
  setValidators() {
    this.formValidators[this.currentStep]?.validators?.forEach(
      (validator: any) => {
        this.form.get(validator.field)?.addValidators(validator.validators);
        this.form.get(validator.field)?.updateValueAndValidity();
      }
    );
  }

  /** Rimuove le validazioni dal Form */
  removeValidators() {
    this.formValidators.forEach((validator: any) => {
      if (validator?.validators?.length) {
        validator.validators?.forEach((val: any) => {
          this.form.get(val.field)?.removeValidators(val.validators);
          this.form.get(val.field)?.updateValueAndValidity();
        });
      }
    });
  }

  /**
   * Aggiunge validators al From
   * @param {any} validators I validators da aggiungere
   */
  addValidators(validators: any) {
    validators?.forEach((validator: any) => {
      this.form.get(validator.field)?.addValidators(validator.validators);
      this.form.get(validator.field)?.updateValueAndValidity();
    });
  }

  /**
   * Cambia lo step
   * @param {number} step Lo step a cui andare
   */
  changeStep(step: number = 0) {
    this.currentStep = step;
    if (this.formValidators?.length) {
      this.removeValidators();
    }
    this.loadComponent();
  }

  /**
   * Effettua il submit del form.
   */
  confirmSubmit() {
    this.data.callback(this.form);
  }
}
