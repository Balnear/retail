import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
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
} from '../../../../constants';
import { BreadcrumbsPipe } from '../../../../pipes';
import { GenericConfirmModalComponent } from '../../../../shared';

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
  editOrChangeProfile() {}
}
