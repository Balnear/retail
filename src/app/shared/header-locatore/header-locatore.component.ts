import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AngularMaterialModule } from '../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import {
  LocatoriService,
  LoaderSpinnerService,
  CaseService,
  LoginService,
  NotificationService,
} from '../../services';
import { CustomDialogService } from '../../services/dialog.service';
import {
  LABEL_CONSTANT,
  ICON_CONSTANT,
  BUTTON_CONSTANT,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
} from '../../constants';
import {
  GenericConfirmModalComponent,
  GenericDetailModalComponent,
  GenericFeedbackModalComponent,
  GenericFormModalComponent,
} from '../generics';
import { CustomValidator } from '../../utils';
import { FormCreaLocatoreComponent } from '../form-crea-locatore/form-crea-locatore.component';

/**Componente header del dettaglio del locatore */
@Component({
  selector: 'app-header-locatore',
  standalone: true,
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header-locatore.component.html',
  styleUrls: ['./header-locatore.component.scss'],
})
export class HeaderLocatoreComponent {
  /**costanti per la visualizzazione */
  labelCostant = LABEL_CONSTANT;
  /**costanti per le icone */
  iconCostant = ICON_CONSTANT;
  /** I dati del locatore */
  locatore: any;
  /** Riferimento al matDialog */
  dialogRef: any;
  /**modifica dello stato */
  editStatus: boolean = false;
  /** Contiene il form */
  form!: FormGroup;
  /** URL del imagine del profilo */
  image!: string;
  /** Dati utente corrente */
  currentUser!: any;

  /**
   * Il construttore della classe
   * @param {LocatoriService} locatoriService - Injectable del service LocatoriService per gestire le operazioni sui locatori.
   * @param {CustomDialogService} customDialogService Service customDialogService
   * @param {LoaderSpinnerService } loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {GenericDetailModalComponent} genericDetailModalComponent La chiamata alla componente modale dettaglio
   * @param {MatDialog} dialog Injectable del service MatDialog
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private notifica: NotificationService,
    public loginService: LoginService,
    private locatoriService: LocatoriService,
    private caseService: CaseService,
    private customDialogService: CustomDialogService,
    private loaderSpinnerService: LoaderSpinnerService,
    private genericDetailModalComponent: GenericDetailModalComponent,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.locatore = this.locatoriService.dettaglioLocatore;
    this.currentUser = this.loginService.getCurrentUserFromLocalStorage();
  }

  /**Funzione per la chiusura della dialog */
  closeDialog() {
    this.genericDetailModalComponent.closeDialog();
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

  /**Rimuove il validatore */
  removeValidationError(...control: string[]) {
    control.map((c) => {
      this.form.get(c)?.setErrors(null);
    });
  }

  /**Metodo per modificare il profilo del locatore */
  modificaLocatore(id: string) {
    this.loaderSpinnerService.show();
    this.locatoriService.getLocatore(id).subscribe({
      next: (res) => {
        this.loaderSpinnerService.hide();
        const nome = this.locatore.displayName.split(' ')[0].trim();
        const cognome = this.locatore.displayName.split(' ').pop().trim();
        this.locatoriService.email = this.locatore.email;
        this.dialogRef = this.dialog.open(GenericFormModalComponent, {
          width: '824px',
          height: '864px',
          disableClose: true,
          autoFocus: false,
          data: {
            form: this.fb.group(
              {
                uid: this.locatore.uid,
                nome: [
                  nome,
                  [Validators.required, Validators.pattern(/^[a-zA-Z]{1,40}$/)],
                ],
                cognome: [
                  cognome,
                  [Validators.required, Validators.pattern(/^[a-zA-Z]{1,40}$/)],
                ],
                email: [
                  this.locatore.email,
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
                userType: [{ value: this.locatore.userType, disabled: true }],
                phoneNumber: [
                  this.locatore.phoneNumber,
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
            callback: (form: any) => this.submitFormModificaLocatore(form),
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
        console.error(
          'Errore durante il caricamento del profilo:',
          err.message || err
        );
      },
    });
  }

  /**Elimina il profilo del locatore */
  eliminaLocatore(id: string) {
    this.dialog
      .open(GenericConfirmModalComponent, GENERIC_CONFIRM.elimina_locatore)
      .afterClosed()
      .subscribe((res) => {
        this.loaderSpinnerService.show();
        if (res) {
          this.loaderSpinnerService.hide();
          if (id != this.currentUser.uid) {
            //Elimina le case associate
            this.eliminaCaseLocatore(id);
            this.locatoriService.deleteUserProfile(id).subscribe({
              next: () => {
                this.loaderSpinnerService.hide();
                this.dialog.open(
                  GenericFeedbackModalComponent,
                  GENERIC_FEEDBACK.eliminazione_profilo_locatore
                );
              },
              error: (err) => {
                this.loaderSpinnerService.hide();
                console.error(
                  "Errore durante l'eliminazione del profilo:",
                  err.message || err
                );
              },
            });
          } else {
            this.loaderSpinnerService.hide();
            this.notifica.show(
              "Per eliminare la tua utenza contatta l'amministratore",
              5000,
              'error'
            );
          }
        } else {
          this.loaderSpinnerService.hide();
        }
      });
  }

  /**Elimina tutte le case associate al locatore */
  eliminaCaseLocatore(idLocatore: string) {
    this.caseService.getAllCase(idLocatore).subscribe({
      next: (res) => {
        if (res) {
          const deleteRequests = res.map((casa) =>
            this.caseService.eliminaCasa(casa.id)
          );
        }
      },
      error: (err) => {
        console.error(
          "Errore durante l'eliminazione delle case:",
          err.message || err
        );
      },
    });
  }

  /** submitForm modifica locatore ed aggiornamento lista locatori */
  submitFormModificaLocatore(form: any) {
    this.loaderSpinnerService.show();
    const uid = this.locatore.uid;
    const email = form.value.email;
    const password = form.value.password;
    const userType = this.locatore.userType;
    const displayName = form.value.nome + ' ' + form.value.cognome;
    const phoneNumber = form.value.phoneNumber;
    const status = 'Offline';
    if (form.value.photoURL === '') {
      this.locatoriService.imageURL = this.locatore.photoURL;
      this.image = this.locatoriService.imageURL;
    } else {
      this.image = this.locatoriService.imageUrls;
    }
    const photoURL = this.image;
    // //Aggiorna l'email
    if (this.locatore.email != email) {
      //Se cambia l'email elimina lo user e ne crea un'altro
      this.locatoriService.deleteUserProfile(uid).subscribe({
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
            this.loaderSpinnerService.hide();
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
            if (uid != this.currentUser.uid) {
              this.dialog
                .open(
                  GenericFeedbackModalComponent,
                  GENERIC_FEEDBACK.modifiche_salvate
                )
                .afterClosed()
                .subscribe(() => {});
            } else {
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
            }
          },
          error: (err) => {
            this.loaderSpinnerService.hide();
          },
        });
    } else {
      this.locatoriService
        .aggiornaProfiloLocatore(uid, email, displayName, phoneNumber, photoURL)
        .subscribe({
          next: (res) => {
            this.loaderSpinnerService.hide();
            this.closeDialog();
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
            this.loaderSpinnerService.hide();
          },
        });
    }
  }
}
