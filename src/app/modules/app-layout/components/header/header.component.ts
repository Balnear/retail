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
    private loaderSpinner: LoaderSpinnerService,
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
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '864px',
      disableClose: true,
      autoFocus: false,
      data: {
        form: this.fb.group({
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
            [
              Validators.required,
              CustomValidator.conditionalEmailValidator(
                this.data.email,
                this.locatoriService.emailExistsValidator()
              ),
            ],
          ],
          password: [{ value: '', disabled: true }],
          repeatPassword: [{ value: '', disabled: true }],
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
        }),

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

  /** submitForm creazione locatore ed aggiornamento lista locatori */
  submitForm(form: any) {
    this.loaderSpinner.show();
    const uid = this.data.uid;
    const email = form.value.email;
    const displayName = form.value.nome + ' ' + form.value.cognome;
    const phoneNumber = form.value.phoneNumber;
    if (form.value.photoURL === '') {
      this.locatoriService.imageURL = this.data.photoURL;
      this.image = this.locatoriService.imageURL;
    } else {
      this.image = this.locatoriService.imageUrls;
    }
    const photoURL = this.image;
    // //Aggiorna l'email
    if (this.data.email != form.value.email) {
      this.locatoriService.aggiornaEmailLocatore(form.value.email);
    }
    this.locatoriService
      .aggiornaProfiloLocatore(uid, email, displayName, phoneNumber, photoURL)
      .subscribe({
        next: (res) => {
          this.data = this.loginService.getCurrentUserFromLocalStorage();
          this.loaderSpinner.hide();
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

  /**Rimuove il validatore */
  removeValidationError(...control: string[]) {
    control.map((c) => {
      this.form.get(c)?.setErrors(null);
    });
  }
}
