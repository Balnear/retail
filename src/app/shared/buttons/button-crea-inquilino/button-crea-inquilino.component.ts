import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import {
  InquiliniService,
  LoaderSpinnerService,
  LocatoriService,
  LoginService,
} from '../../../services';
import {
  BUTTON_CONSTANT,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
  LABEL_CONSTANT,
} from '../../../constants';
import { CustomValidator } from '../../../utils';
import {
  GenericFormModalComponent,
  GenericConfirmModalComponent,
  GenericFeedbackModalComponent,
} from '../../generics';
import { FormCreaInquilinoComponent } from '../../form-crea-inquilino/form-crea-inquilino.component';

/**Componente ButtonCreaInquilino */
@Component({
  selector: 'app-button-crea-inquilino',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './button-crea-inquilino.component.html',
  styleUrl: './button-crea-inquilino.component.scss',
})
export class ButtonCreaInquilinoComponent {
  /**Costante button */
  button_constant = BUTTON_CONSTANT;
  /**DialogRef riferimento al dialog*/
  dialogRef: any;
  /** Contiene il form */
  form!: FormGroup;
  /** URL del imagine del profilo */
  image!: string;
  /** Id del locatore loggato */
  currentId!: string;

  /**
   * Il costruttore della classe ButtonCreaCaseComponent
   * @param {LoaderSpinnerService} loaderSpinnerService  Service loaderSpinnerService
   * @param {InquiliniService} inquiliniService  Service inquiliniService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    private inquiliniService: InquiliniService,
    private locatoriService: LocatoriService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.currentId = this.loginService.currentId;
  }

  /**Apertura del panel per la creazione del inquilino */
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
              this.inquiliniService.emailExistsValidator(),
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
            phoneNumber: [
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

        submitFormText: BUTTON_CONSTANT.crea_inquilino,
        headerLabels: {
          title: LABEL_CONSTANT.aggiungi_inquilino,
          subtitle: LABEL_CONSTANT.inserisci_dati_inquilino,
        },

        component: FormCreaInquilinoComponent,
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
    form.value.status = 'Offline';
    const locatoreId = this.currentId;
    const email = form.value.email;
    const password = form.value.password;
    if (form.value.photoURL === '') {
      this.inquiliniService.imageURL =
        '../../../../../assets/images/img-profile.png';
      this.image = this.inquiliniService.imageURL;
    } else {
      this.image = this.inquiliniService.imageUrls;
    }
    const userType = form.value.userType;
    const phoneNumber = form.value.phoneNumber;
    const photoURL = this.image;
    const displayName = form.value.nome + ' ' + form.value.cognome;
    const status = form.value.status;
    this.inquiliniService
      .creaInquilino(
        locatoreId,
        email,
        password,
        displayName,
        userType,
        phoneNumber,
        status,
        photoURL
      )
      .subscribe({
        next: (res) => {
          const inquilinoId = res?.uid;
          console.log(locatoreId, 'locatoreid');
          if (inquilinoId) {
            this.loaderSpinnerService.hide();
            this.closeModal();

            this.locatoriService.aggiornaInquiliniLocatore(
              locatoreId,
              inquilinoId
            );
            this.dialog
              .open(
                GenericFeedbackModalComponent,
                GENERIC_FEEDBACK.crea_inquilino
              )
              .afterClosed()
              .subscribe(() => {});
          } else {
            this.loaderSpinnerService.hide();
          }
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
