import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginService, LoaderSpinnerService } from '../../../../services';
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
  GenericFormModalComponent,
  GenericFeedbackModalComponent,
} from '../../../../shared';

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
      callback: () => this.editOrChangeProfile(),
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

  /**
   * Il costruttore della classe
   * @param {LoginService} loginService Injectable del service Login
   * @param {LoaderSpinnerService} loadSpinnerService Injecatble del service loadSpinner
   * @param {MatDialog} dialog Injectable del service MatDialog
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private loginService: LoginService,
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
            this.loginService.logout();
            this.loginService.goToLogin();
            this.loginService.clearStorage();
          }
        },
        error: (err) => {},
      });
  }

  /**Modifica i dati del profilo utente */
  editOrChangeProfile() {
    const nome = this.data.displayName.split(' ')[0].trim();
    const cognome = this.data.displayName.split(' ').pop().trim();
    // Data saved successfully!
    this.dialogRef = this.dialog.open(GenericFormModalComponent, {
      width: '824px',
      height: '864px',
      scrollStrategy: new NoopScrollStrategy(),
      disableClose: true,
      data: {
        form: this.fb.group({
          uid: this.data.uid,
          nome: [{ value: nome, disabled: true }],
          cognome: [{ value: cognome, disabled: true }],
          telphoneNumber: [
            this.data.telphoneNumber,
            [
              Validators.required,
              Validators.minLength(10),
              Validators.maxLength(15),
              Validators.pattern('[0-9 +]*'),
            ],
          ],
          email: [
            this.data.email,
            [
              Validators.required,
              Validators.pattern(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
              ),
            ],
          ],
          profile_picture: [this.data.profile_picture],
        }),
        headerLabels: {
          // title: LABEL_CONSTANT.modifica_utente,
          // subtitle: LABEL_CONSTANT.modifica_dati_utente,
        },
        submitFormText: BUTTON_CONSTANT.salva,
        showTipologia: true,
        // component: FormAggiornaUtenteComponent,
        // callback: (form: any) => this.submitForm(form),
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
          this.loaderSpinner.show();
          setTimeout(() => {
            this.loaderSpinner.hide();
          }, 2000); // Nascondi lo spinner dopo la chiusura del modal
        });
    });
  }

  /**Aggiornamento numero di telefono USER */
  // onUpdatePhoneNumber(userId: string, newPhoneNumber: string) {
  //   this.userService
  //     .updatePhoneNumber(userId, newPhoneNumber)
  //     .subscribe(() => {
  //       this.data.telphoneNumber = newPhoneNumber;
  //       localStorage.setItem(`user_${userId}_telphoneNumber`, newPhoneNumber);
  //     });
  // }

  /** submitForm aggiornamento profilo utente */
  // submitForm(form: any) {
  //   const obj = form.value;
  //   this.userService
  //     .editProfile(obj.uid, obj.email, obj.profile_picture)
  //     .then(() => {
  //       this.onUpdatePhoneNumber(obj.uid, obj.phoneNumber);
  //       this.data.telphoneNumber = obj.phoneNumber;
  //       this.data.profile_picture = obj.profile_picture;
  //       this.dialogRef.close();
  //       this.dialog
  //         .open(
  //           GenericFeedbackModalComponent,
  //           GENERIC_FEEDBACK.modifiche_salvate
  //         )
  //         .afterClosed()
  //         .subscribe(() => {
  //           this.loaderSpinner.show();
  //           setTimeout(() => {
  //             this.loaderSpinner.hide();
  //           }, 2000); // Nascondi lo spinner dopo la chiusura del modal
  //         });
  //     })
  //     .catch((error) => {
  //       this.loaderSpinner.hide();
  //       this.userService.firebaseError(error.code);
  //     });
  // }
}
