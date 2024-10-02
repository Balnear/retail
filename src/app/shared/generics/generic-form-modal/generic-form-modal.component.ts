import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { GenericConfirmModalComponent } from '..';
import { BUTTON_CONSTANT, GENERIC_CONFIRM } from '../../../constants';
import { StepDirective } from '../../../directives';
import { GenericFormInterface } from '../../../models';
import { AngularMaterialModule } from '../../../modules/material-module';
import { CustomDialogService } from '../../../services/dialog.service';

/** Componente generica per le modali a singolo step */
@Component({
  selector: 'app-generic-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    StepDirective,
  ],
  templateUrl: './generic-form-modal.component.html',
  styleUrls: ['./generic-form-modal.component.scss'],
})
export class GenericFormModalComponent {
  /** Decoratore ViewChild per l'elemento con la direttiva dello stepper */
  @ViewChild(StepDirective, { static: true }) stepHost!: StepDirective;
  /** Label per le CTA */
  buttonConstant = BUTTON_CONSTANT;
  /** FormGroup del form generico  */
  form!: FormGroup;
  /** Indica se la modale di conferma è già aperta */
  modalConfirmOpened: boolean = false;
  formDirty = false;

  /**
   * Il costruttore della classe GenericFormModalComponent
   * @param { CustomDialogService } customDialogService L'injectable del service CustomDialogService
   * @param { ChangeDetectorRef } changeDetectorRef L'injectable del ChangeDetectorRef
   * @param { MatDialog } dialog L'injectable del service per aprire la modale
   * @param { FormBuilder }fb L'injectable del FormBuilder
   * @param { MatDialogRef<GenericFormModalComponent> } dialogRef il riferimento alla modale
   * @param { any } data Oggetto dei dati per la modale
   */
  constructor(
    public customDialogService: CustomDialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenericFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenericFormInterface
  ) {}

  /**
   * Lifecycle Hook dell'OnInit in cui si settano le informazioni ricevuto in fase di apertura modale.
   */
  ngOnInit(): void {
    this.form = this.data.form;
    this.form.valueChanges.subscribe(() => {
      this.formDirty = true;
    });
    this.loadComponent();
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

  /** Setta la variabile per il controllo dei dati inseriti nel form a false */
  ngOnDestroy() {
    this.customDialogService.hasFormValues = false;
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
            this.dialogRef.close();
          }
          this.modalConfirmOpened = false;
        });
      }
    } else this.dialogRef.close();
  }

  /**
   * Carica il componente al cambio dello step
   */
  loadComponent() {
    const viewContainerRef = this.stepHost.viewContainerRef;
    viewContainerRef.clear();
    if (this.data.component) {
      viewContainerRef.createComponent<any>(this.data.component);
    }
  }
}
