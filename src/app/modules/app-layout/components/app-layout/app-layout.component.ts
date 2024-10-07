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
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import { MatDialog } from '@angular/material/dialog';
import {
  GenericTableService,
  LoaderSpinnerService,
  LoginService,
} from '../../../../services';
import {
  DASHBOARD_HEADER,
  ICON_CONSTANT,
  LABEL_CONSTANT,
} from '../../../../constants';
import { SetTextByUrlPipe } from '../../../../pipes';
import { HeaderComponent } from '../header/header.component';
import { AppSidebarComponent } from '../sidebar/sidebar.component';
import { GenericDropDownMenuComponent } from '../../../../shared/generics/generic-drop-down-menu/generic-drop-down-menu.component';
import { ButtonCreaCasaComponent } from '../../../../shared/buttons/button-crea-casa/button-crea-casa.component';

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
  section!: '' | 'dashboard' | 'locatori' | 'inquilini';
  /**
   * Sottoscrizione all'evento di navigazione della Router
   */
  private routerEventsSubscription = new Subscription();
  /** Le actions della dropdown del dettaglio zona*/
  actions: any[] = [
    {
      name: LABEL_CONSTANT.elimina,
      icon: ICON_CONSTANT.delete,
      // callback: () => this.eliminaCasa(this.caseService.idCasa),
    },
  ];
  /** Le action della dropdown generica */
  action: any[] = [];

  /**
   * Il costruttore della classes.
   * Si inizializza il FormGroup.
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service loaderSpinnerService
   * @param {FormBuilder} fb L'injectable del FormBuilder
   * @param {MatDialog} dialog L'injectable del token
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private genericTableService: GenericTableService,
    private loaderSpinnerService: LoaderSpinnerService,
    public loginService: LoginService,
    private router: Router,
    private dialog: MatDialog
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
    } else {
      this.section = '';
    }
  }
}
