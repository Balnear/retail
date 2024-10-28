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
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import { MatDialog } from '@angular/material/dialog';
import {
  CaseService,
  LoaderSpinnerService,
  LoginService,
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
} from '../../../../shared';
import { SelectCreazioneTipologiaComponent } from '../../../../shared/select-creazione-tipologia/select-creazione-tipologia.component';
import { SelectEliminaTipologiaComponent } from '../../../../shared/select-elimina-tipologia/select-elimina-tipologia.component';
import { ButtonCreaLocatoreComponent } from '../../../../shared/buttons/button-crea-locatore/button-crea-locatore.component';
import { ButtonCreaInquilinoComponent } from '../../../../shared/buttons/button-crea-inquilino/button-crea-inquilino.component';
import { ButtonAssegnaCasaComponent } from '../../../../shared/buttons/button-assegna-casa/button-assegna-casa.component';

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

  /**
   * Il costruttore della classe.
   * Si inizializza il FormGroup.
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service loaderSpinnerService
   * @param {FormBuilder} fb L'injectable del FormBuilder
   * @param {MatDialog} dialog L'injectable del token
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    public loginService: LoginService,
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
      this.actions = [];
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

  /** Chiude la modale */
  closeModal() {
    this.dialogRef.close();
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
}
