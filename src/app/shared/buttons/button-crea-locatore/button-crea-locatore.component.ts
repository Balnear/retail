import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import { LoaderSpinnerService, LocatoriService } from '../../../services';
import { CustomDialogService } from '../../../services/dialog.service';
import {
  BUTTON_CONSTANT,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
  LABEL_CONSTANT,
} from '../../../constants';
import {
  GenericFormModalComponent,
  GenericFeedbackModalComponent,
  GenericConfirmModalComponent,
} from '../../generics';
import { FormCreaLocatoreComponent } from '../../form-crea-locatore/form-crea-locatore.component';
import { CustomValidator } from '../../../utils';

/**Componente ButtonCreaLocatore */
@Component({
  selector: 'app-button-crea-locatore',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './button-crea-locatore.component.html',
  styleUrl: './button-crea-locatore.component.scss',
})
export class ButtonCreaLocatoreComponent {
  /**Costante button */
  button_constant = BUTTON_CONSTANT;
  /**DialogRef riferimento al dialog*/
  dialogRef: any;
  /** Contiene il form */
  form!: FormGroup;
  /** URL del imagine del profilo */
  image!: string;
  /** Emetti quando viene aggiunto un locatore TODO: da gestire */
  // @Output() locatoreAdded = new EventEmitter<any>();

  /**
   * Il costruttore della classe ButtonCreaLocatoreComponent
   * @param {CustomDialogService} customDialogService  Service customDialogService
   * @param {LoaderSpinnerService} loaderSpinnerService  Service loaderSpinnerService
   * @param {LocatoriService} locatoriService  Service locatoriService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private customDialogService: CustomDialogService,
    private loaderSpinnerService: LoaderSpinnerService,
    private locatoriService: LocatoriService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  /**Apertura del panel per la creazione del locatore */
  openDialog() {
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '864px',
      disableClose: true,
      autoFocus: false,
      data: {
        form: this.fb.group(
          {
            email: [
              '',
              Validators.required,
              this.locatoriService.emailExistsValidator(),
            ],

            password: [
              '',
              [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/[A-Z]/), // Almeno una lettera maiuscola
                Validators.pattern(/[0-9]/), // Almeno un numero
                CustomValidator.specialCharacterValidator(), // Validatore personalizzato per caratteri speciali
              ],
            ],
            repeatPassword: [
              '',
              [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(64),
              ],
            ],
            nome: [
              '',
              [Validators.required, Validators.pattern(/^[a-zA-Z]{1,40}$/)],
            ],
            cognome: [
              '',
              [Validators.required, Validators.pattern(/^[a-zA-Z]{1,40}$/)],
            ],
            photoURL: [''],
            userType: ['', [Validators.required]],
            numberPhone: [
              '',
              [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(15),
                Validators.pattern('[0-9 +]*'),
              ],
            ],
          },
          { validator: this.passwordMatchValidator }
        ),

        submitFormText: BUTTON_CONSTANT.crea_locatore,
        headerLabels: {
          title: LABEL_CONSTANT.aggiungi_locatore,
          subtitle: LABEL_CONSTANT.inserisci_dati_locatore,
        },

        component: FormCreaLocatoreComponent,
        callback: (form: any) => this.submitForm(form),
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

  /**Password validator match */
  passwordMatchValidator(form: FormGroup) {
    const passwordValue = form.get('password')?.value;
    const repeatPasswordValue = form.get('repeatPassword')?.value;

    if (passwordValue !== repeatPasswordValue) {
      form.get('repeatPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  /** Chiude la modale */
  closeModal() {
    this.dialogRef.close();
  }
  /** submitForm creazione locatore ed aggiornamento lista locatori */
  submitForm(form: any) {
    this.loaderSpinnerService.show();
    console.log(form.value, 'form');
    const email = form.value.email;
    const password = form.value.password;
    if (form.value.photoURL === '') {
      this.locatoriService.imageURL =
        '../../../../../assets/images/img-profile.png';
      this.image = this.locatoriService.imageURL;
    } else {
      this.image = this.locatoriService.imageUrls;
    }
    const userType = form.value.userType;
    const phoneNumber = form.value.numberPhone;
    const photoURL = this.image;
    const displayName = form.value.nome + ' ' + form.value.cognome;
    this.locatoriService
      .creaLocatore(
        email,
        password,
        displayName,
        userType,
        phoneNumber,
        photoURL
      )
      .subscribe({
        next: (res) => {
          this.loaderSpinnerService.hide();
          this.closeModal();
          this.dialog
            .open(GenericFeedbackModalComponent, GENERIC_FEEDBACK.crea_locatore)
            .afterClosed()
            .subscribe(() => {
              // this.locatoreAdded.emit(res);
            });
        },
        error: (err) => {
          this.loaderSpinnerService.hide();
        },
      });
  }

  /**Rimuove il validatore */
  removeValidationError(...control: string[]) {
    control.map((c) => {
      this.form.get(c)?.setErrors(null);
    });
  }
}
