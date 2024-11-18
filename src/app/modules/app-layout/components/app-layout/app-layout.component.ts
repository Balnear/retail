import { Component } from '@angular/core';
import {
  RouterModule,
  Router,
  NavigationEnd,
  NavigationStart,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import { MatDialog } from '@angular/material/dialog';
import {
  CaseService,
  LoaderSpinnerService,
  LocatoriService,
  LoginService,
  NotificationService,
} from '../../../../services';
import { CustomDialogService } from '../../../../services/dialog.service';
import {
  BUTTON_CONSTANT,
  DASHBOARD_HEADER,
  GENERIC_CONFIRM,
  GENERIC_FEEDBACK,
  ICON_CONSTANT,
  LABEL_CONSTANT,
} from '../../../../constants';
import { SetTextByUrlPipe } from '../../../../pipes';
import { HeaderComponent } from '../header/header.component';
import { AppSidebarComponent } from '../sidebar/sidebar.component';
import { GenericDropDownMenuComponent } from '../../../../shared/generics/generic-drop-down-menu/generic-drop-down-menu.component';
import { ButtonCreaCasaComponent } from '../../../../shared/buttons/button-crea-casa/button-crea-casa.component';
import {
  GenericConfirmModalComponent,
  GenericFeedbackModalComponent,
  GenericFormModalComponent,
  SelectAggiornaProfiloLocatoreComponent,
  SelectEliminaProfiloLocatoreComponent,
} from '../../../../shared';
import { SelectCreazioneTipologiaComponent } from '../../../../shared/select-creazione-tipologia/select-creazione-tipologia.component';
import { SelectEliminaTipologiaComponent } from '../../../../shared/select-elimina-tipologia/select-elimina-tipologia.component';
import { ButtonCreaLocatoreComponent } from '../../../../shared/buttons/button-crea-locatore/button-crea-locatore.component';
import { ButtonCreaInquilinoComponent } from '../../../../shared/buttons/button-crea-inquilino/button-crea-inquilino.component';
import { ButtonAssegnaCasaComponent } from '../../../../shared/buttons/button-assegna-casa/button-assegna-casa.component';
import { FormCreaLocatoreComponent } from '../../../../shared/form-crea-locatore/form-crea-locatore.component';
import { CustomValidator } from '../../../../utils';

/**
 * Component utilizzato come layout per le pagine dell'applicazione.
 */
@Component({
  selector: 'app-app-layout',
  standalone: true,
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  imports: [
    AngularMaterialModule,
    AppSidebarComponent,
    CommonModule,
    HeaderComponent,
    RouterModule,
    SetTextByUrlPipe,
    GenericDropDownMenuComponent,
    ButtonCreaCasaComponent,
    ButtonCreaLocatoreComponent,
    ButtonCreaInquilinoComponent,
    ButtonAssegnaCasaComponent,
  ],
})
export class AppLayoutComponent {
  /* Dichiarazione delle variabili utilizzate */
  dashboardHeader = DASHBOARD_HEADER;
  /** Il titolo della pagine */
  title = '';
  /** Subscription all'observable degli eventi del router */
  routingSubscriptionNavigationEnd!: Subscription;
  /** Richiamo la ICON_CONSTANT */
  iconConstant = ICON_CONSTANT;
  /** Le actions della dropdown */
  /**Variabile section */
  section!: '' | 'dashboard' | 'locatori' | 'inquilini' | 'assegna-casa';
  /**
   * Sottoscrizione all'evento di navigazione della Router
   */
  private routerEventsSubscription = new Subscription();
  /** Le actions della dropdown del dettaglio zona*/
  actions: any[] = [];
  /** Le action della dropdown generica */
  action: any[] = [];
  /**DialogRef riferimento al dialog*/
  dialogRef: any;
  /**Dati del locatore */
  data!: any;
  /** Contiene il form */
  form!: FormGroup;
  /** URL del imagine del profilo */
  image!: string;

  /**
   * Il costruttore della classe.
   * Si inizializza il FormGroup.
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service loaderSpinnerService
   * @param {NotificationService} notifica L'injectable del service notificationService
   * @param {LoginService} loginService L'injectable del service loginService
   * @param {LocatoriService} locatoriService L'injectable del service locatoriService
   * @param {CaseService} caseService L'injectable del service caseService
   * @param {FormBuilder} fb L'injectable del FormBuilder
   * @param {MatDialog} dialog L'injectable del token
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    private notifica: NotificationService,
    public loginService: LoginService,
    private locatoriService: LocatoriService,
    private caseService: CaseService,
    private router: Router,
    private customDialogService: CustomDialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  /** Lifecycle hook dell'onInit, si aggiunge il loader spinner al cambio della rotta */
  ngOnInit() {
    this.loginService.landingUrl = '';
    this.setSection();
    this.routingSubscriptionNavigationEnd = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationStart) {
          if (!this.loginService.landingUrl) {
            this.loaderSpinnerService.show();
          }
        } else if (
          e instanceof NavigationCancel ||
          e instanceof NavigationError
        ) {
          this.loaderSpinnerService.hide();
        } else if (e instanceof NavigationEnd) {
          this.setSection();
          this.loaderSpinnerService.hide();
        }
      }
    );
    const savedElements = localStorage.getItem('tipologie');
    if (savedElements) {
      this.caseService.tipologie = JSON.parse(savedElements);
    }
  }

  /* Metodo chiamato alla distruzione del componente */
  ngOnDestroy(): void {
    /* Scollegamento dalla sottoscrizione dell'evento di navigazione */
    this.routerEventsSubscription.unsubscribe();
  }

  /**Controllo URL, setta una variabile section con il tipo della componente corrispondente */
  setSection() {
    if (this.router.url.includes('/bo/dashboard')) {
      this.section = 'dashboard';
    } else if (this.router.url.includes('/bo/locatori')) {
      this.section = 'locatori';
    } else if (this.router.url.includes('/bo/inquilini')) {
      this.section = 'inquilini';
    } else if (this.router.url.includes('/bo/assegna-casa')) {
      this.section = 'assegna-casa';
    } else {
      this.section = '';
    }
    if (this.section == 'dashboard') {
      this.actions = [
        {
          name: LABEL_CONSTANT.aggiungi_tipologia,
          icon: ICON_CONSTANT.add,
          callback: () => this.aggiungiTipologia(),
        },
        {
          name: LABEL_CONSTANT.elimina_tipologia,
          icon: ICON_CONSTANT.delete,
          callback: () => this.eliminaTipologia(),
        },
      ];
    } else {
      if (this.section == 'locatori') {
        this.actions = [
          {
            name: LABEL_CONSTANT.modifica_locatore,
            icon: ICON_CONSTANT.edit,
            callback: () => this.modificaProfiloLocatore(),
          },
          {
            name: LABEL_CONSTANT.elimina_locatore,
            icon: ICON_CONSTANT.delete,
            callback: () => this.eliminaProfiloLocatore(),
          },
        ];
      } else {
        this.actions = [];
      }
    }
  }

  /** Metodo per aggiungere una tipologia alla select */
  aggiungiTipologia() {
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '290px',
      disableClose: true,
      autoFocus: false,
      data: {
        form: this.fb.group({
          newElement: ['', Validators.required],
        }),
        submitFormText: BUTTON_CONSTANT.aggiungi,
        headerLabels: {
          title: LABEL_CONSTANT.aggiungi_tipologia,
          subtitle: LABEL_CONSTANT.inserisci_dati,
        },

        component: SelectCreazioneTipologiaComponent,
        callback: (form: any) => this.submitFormAggiungi(form),
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

  /** Metodo per eliminare una tipologia dalla select */
  eliminaTipologia() {
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '290px',
      disableClose: true,
      autoFocus: false,
      data: {
        form: this.fb.group({
          elementSelected: ['', Validators.required],
        }),
        submitFormText: BUTTON_CONSTANT.elimina,
        headerLabels: {
          title: LABEL_CONSTANT.elimina_tipologia,
          subtitle: LABEL_CONSTANT.elimina_dati,
        },

        component: SelectEliminaTipologiaComponent,
        callback: (form: any) => this.submitFormElimina(form),
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

  /**Metodo per modificare il profilo del locatore */
  modificaProfiloLocatore() {
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '290px',
      disableClose: true,
      autoFocus: false,
      data: {
        form: this.fb.group({
          elementSelected: ['', Validators.required],
        }),
        submitFormText: BUTTON_CONSTANT.modifica_profilo,
        headerLabels: {
          title: LABEL_CONSTANT.modifica_profilo,
          subtitle: LABEL_CONSTANT.aggiorna_dati_locatore,
        },

        component: SelectAggiornaProfiloLocatoreComponent,
        callback: (form: any) => this.formAggiornaProfiloLocatore(form),
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

  /** submitForm aggiorna profilo del locatore selezionato */
  formAggiornaProfiloLocatore(form: any) {
    this.loaderSpinnerService.show();
    this.locatoriService.getLocatore(form.value.elementSelected).subscribe({
      next: (res) => {
        this.loaderSpinnerService.hide();
        this.closeModal();
        this.data = res;
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

  /**Metodo per eliminare un locatore */
  eliminaProfiloLocatore() {
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '290px',
      disableClose: true,
      autoFocus: false,
      data: {
        form: this.fb.group({
          elementSelected: ['', Validators.required],
        }),
        submitFormText: BUTTON_CONSTANT.elimina,
        headerLabels: {
          title: LABEL_CONSTANT.elimina_profilo_locatore,
          subtitle: LABEL_CONSTANT.elimina_dati_locatore,
        },

        component: SelectEliminaProfiloLocatoreComponent,
        callback: (form: any) => this.submitFormEliminaProfiloLocatore(form),
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

  /**Rimuove il validatore */
  removeValidationError(...control: string[]) {
    control.map((c) => {
      this.form.get(c)?.setErrors(null);
    });
  }

  /** submitForm creazione tipologia ed aggiornamento select tipologie */
  submitFormAggiungi(form: any) {
    this.loaderSpinnerService.show();
    this.caseService.addTipologia(form.value.newElement);
    setTimeout(() => {
      this.loaderSpinnerService.hide();
      this.closeModal();
      this.dialog.open(
        GenericFeedbackModalComponent,
        GENERIC_FEEDBACK.aggiungi_tipologia
      );
    }, 5000);
  }

  /** submitForm elimina tipologia ed aggiornamento select tipologie */
  submitFormElimina(form: any) {
    this.loaderSpinnerService.show();
    this.caseService.deleteTipologia(form.value.elementSelected);
    setTimeout(() => {
      this.loaderSpinnerService.hide();
      this.closeModal();
      this.dialog.open(
        GenericFeedbackModalComponent,
        GENERIC_FEEDBACK.eliminazione_tipologia
      );
    }, 5000);
  }

  /** submitForm creazione locatore ed aggiornamento lista locatori */
  submitFormModificaLocatore(form: any) {
    this.loaderSpinnerService.show();
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
            this.loaderSpinnerService.hide();
          },
        });
    } else {
      this.locatoriService
        .aggiornaProfiloLocatore(uid, email, displayName, phoneNumber, photoURL)
        .subscribe({
          next: (res) => {
            this.loaderSpinnerService.hide();
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

  /** submitForm elimina il profilo del locatore selezionato */
  submitFormEliminaProfiloLocatore(form: any) {
    this.loaderSpinnerService.show();
    this.locatoriService
      .deleteUserProfile(form.value.elementSelected)
      .subscribe({
        next: () => {
          this.loaderSpinnerService.hide();
          this.closeModal();
          this.dialog.open(
            GenericFeedbackModalComponent,
            GENERIC_FEEDBACK.eliminazione_profilo_locatore
          );
        },
        error: (err) => {
          console.error(
            "Errore durante l'eliminazione del profilo:",
            err.message || err
          );
        },
      });
  }
}
