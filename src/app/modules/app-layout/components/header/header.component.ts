import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  LoginService,
  LoaderSpinnerService,
  LocatoriService,
  NotificationService,
  CaseService,
} from '../../../../services';
import {
  LABEL_CONSTANT,
  ICON_CONSTANT,
  BREADCRUBS_HEADER,
  GENERIC_CONFIRM,
  BUTTON_CONSTANT,
  GENERIC_FEEDBACK,
} from '../../../../constants';
import { BreadcrumbsPipe } from '../../../../pipes';
import {
  GenericConfirmModalComponent,
  GenericFeedbackModalComponent,
  GenericFormModalComponent,
} from '../../../../shared';
import { FormCreaLocatoreComponent } from '../../../../shared/form-crea-locatore/form-crea-locatore.component';
import { CustomValidator } from '../../../../utils';

/**Component utilizzato come header per le pagine dell'applicazione.*/
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    AngularMaterialModule,
    BreadcrumbsPipe,
    MatSlideToggleModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**Dati dello User */
  data: any;
  /**Dati utente loggato */
  currentUser: any;
  /**Constante label generiche */
  labelConstant = LABEL_CONSTANT;
  /**Constante icone generiche */
  iconConstant = ICON_CONSTANT;
  /** Le breadcrumbs da visualizzare */
  breadcumbsHeader = BREADCRUBS_HEADER;
  /**title */
  title: any;
  /**subTitle */
  subTitle: any;
  /**Percorso */
  breadCrumbsListener!: Subscription;
  /**variabile stringa */
  breadCrumb!: string;
  /**Lista delle opzioni */
  options = [
    {
      icon: this.iconConstant.person,
      label: this.labelConstant.profilo,
      callback: () => this.modificaProfilo(),
    },
    {
      icon: this.iconConstant.logout,
      label: this.labelConstant.logout,
      callback: () => this.logout(),
    },
  ];
  /** Variabile per gestire i dialoghi */
  matDialog: any;
  /**DialogRef riferimento al dialog*/
  dialogRef: any;
  /** Contiene il form */
  form!: FormGroup;
  /** URL del imagine del profilo */
  image!: string;
  userEmailVerified: boolean = false;

  /**
   * Il costruttore della classe
   * @param {LoginService} loginService Injectable del service Login
   * @param {LocatoriService} locatoriService Injectable del service Locatori
   * @param {LoaderSpinnerService} loadSpinner Injecatble del service loadSpinner
   * @param {MatDialog} dialog Injectable del service MatDialog
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private loginService: LoginService,
    private locatoriService: LocatoriService,
    private caseService: CaseService,
    private loaderSpinner: LoaderSpinnerService,
    private notifica: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {}
  /**
   * quando viene inizializzata la pagina,
   */
  ngOnInit() {
    this.currentUser = this.loginService.getCurrentUser();
    // Se desideri anche recuperare dal localStorage:
    this.data = this.loginService.getCurrentUserFromLocalStorage();
    console.log('utente dal localStorage:', this.data);
  }

  /**Funzione per effettuazione logout */
  logout() {
    this.dialog
      .open(GenericConfirmModalComponent, GENERIC_CONFIRM.effettua_logout)
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.loginService.updateUserStatus(this.data.uid, 'Offline');
            this.loginService.logout();
            this.loginService.goToLogin();
            this.loginService.clearStorage();
          }
        },
        error: (err) => {},
      });
  }

  /**Modifica i dati del profilo del locatore */
  modificaProfilo() {
    const nome = this.data.displayName.split(' ')[0].trim();
    const cognome = this.data.displayName.split(' ').pop().trim();
    this.locatoriService.email = this.data.email;
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '864px',
      disableClose: true,
      autoFocus: false,
      data: {
        form: this.fb.group(
          {
            uid: this.data.uid,
            nome: [
              nome,
              [Validators.required, Validators.pattern(/^[a-zA-Z]{1,40}$/)],
            ],
            cognome: [
              cognome,
              [Validators.required, Validators.pattern(/^[a-zA-Z]{1,40}$/)],
            ],
            email: [
              this.data.email,
              [Validators.required],
              [this.locatoriService.emailExistsValidator()],
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
            photoURL: [''],
            userType: [{ value: this.data.userType, disabled: true }],
            phoneNumber: [
              this.data.phoneNumber,
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

        submitFormText: BUTTON_CONSTANT.modifica_profilo,
        headerLabels: {
          title: LABEL_CONSTANT.modifica_profilo,
          subtitle: LABEL_CONSTANT.aggiorna_dati_profilo,
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

  /** Chiude la modale */
  closeModal() {
    this.dialogRef.close();
  }

  /**Password validator match */
  passwordMatchValidator(form: FormGroup) {
    const passwordValue = form.get('password')?.value;
    const repeatPasswordValue = form.get('repeatPassword')?.value;

    if (passwordValue !== repeatPasswordValue) {
      form.get('repeatPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  /** submitForm creazione locatore ed aggiornamento lista locatori */
  submitForm(form: any) {
    this.loaderSpinner.show();
    const uid = this.data.uid;
    const email = form.value.email;
    const password = form.value.password;
    const userType = this.data.userType;
    const displayName = form.value.nome + ' ' + form.value.cognome;
    const phoneNumber = form.value.phoneNumber;
    const status = 'Offline';
    if (form.value.photoURL === '') {
      this.locatoriService.imageURL = this.data.photoURL;
      this.image = this.locatoriService.imageURL;
    } else {
      this.image = this.locatoriService.imageUrls;
    }
    const photoURL = this.image;
    // //Aggiorna l'email
    if (this.data.email != email) {
      //Se cambia l'email elimina lo user e ne crea un'altro
      this.locatoriService.deleteCurrentUser().subscribe({
        next: (userUid) => {
          this.locatoriService.deleteUserProfile(userUid).subscribe({
            next: () => {
              console.log('Utente e profilo eliminati con successo');
            },
            error: (err) => {
              console.error(
                "Errore durante l'eliminazione del profilo:",
                err.message || err
              );
            },
          });
        },
        error: (err) => {
          console.error(
            "Errore durante l'eliminazione dell'utente:",
            err.message || err
          );
        },
      });
      this.locatoriService
        .updateEmail(
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
            const newId = res?.uid;
            this.loaderSpinner.hide();
            this.caseService.updateLocatoreIdForCase(uid, newId).subscribe({
              next: () => {
                console.log('Aggiornamento completato con successo');
              },
              error: (err) => {
                console.error(
                  "Errore durante l'aggiornamento delle case:",
                  err.message || err
                );
              },
            });
            this.closeModal();
            this.dialog
              .open(
                GenericFeedbackModalComponent,
                GENERIC_FEEDBACK.modifiche_salvate
              )
              .afterClosed()
              .subscribe(() => {
                this.loginService.logout();
                this.loginService.goToLogin();
                this.loginService.clearStorage();
                this.notifica.show(
                  'Devi riautenticarti per aggiornare le credenziali',
                  -1,
                  'success'
                );
              });
          },
          error: (err) => {
            this.loaderSpinner.hide();
          },
        });
    } else {
      this.locatoriService
        .aggiornaProfiloLocatore(uid, email, displayName, phoneNumber, photoURL)
        .subscribe({
          next: (res) => {
            this.loaderSpinner.hide();
            this.data = this.loginService.getCurrentUserFromLocalStorage();
            this.closeModal();
            this.dialog
              .open(
                GenericFeedbackModalComponent,
                GENERIC_FEEDBACK.modifiche_salvate
              )
              .afterClosed()
              .subscribe(() => {});
          },
          error: (err) => {
            this.loaderSpinner.hide();
          },
        });
    }
  }

  /**Rimuove il validatore */
  removeValidationError(...control: string[]) {
    control.map((c) => {
      this.form.get(c)?.setErrors(null);
    });
  }
}
