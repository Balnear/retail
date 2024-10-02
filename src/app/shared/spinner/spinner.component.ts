import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LABEL_CONSTANT, ERROR_CONSTANT } from '../../constants';
import { AngularMaterialModule } from '../../modules/material-module';
import { LoaderSpinnerService } from '../../services/loader-spinner.service';


/** Componente per lo spinner */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  /**Constante label generiche */
  labelConstant = LABEL_CONSTANT;
  /**Constante errori generici */
  errorConstant = ERROR_CONSTANT;
  /**Observable per la visibilità dello spinner */
  showSpinner: boolean = false;
  /**Observable per la visibilità dell'animazione dopo il login */
  showLoggedIn: boolean = false;
  /** Subscription all'observable dell'evento di mostra/nascondi Loader Spinner */
  showSpinnerEventListenerSubject!: Subscription;
  /** Subscription all'observable dell'evento di mostra/nascondi Animazione */
  showLoggedInEventListenerSubject!: Subscription;

  /**
   * @param {loaderSpinnerService} Injecatble del service loadSpinner
   */
  constructor(private loaderSpinnerService: LoaderSpinnerService) {}

  /**Quando viene inizializzata la pagina */
  ngOnInit(): void {
    /**Loader-Spinner */
    this.showSpinnerEventListenerSubject = this.loaderSpinnerService
      .isVisible()
      .subscribe((show: boolean) => {
        this.showSpinner = show;
      });

    /**Animazione Login */
    this.showLoggedInEventListenerSubject = this.loaderSpinnerService
      .isVisibleLog()
      .subscribe((showLog: boolean) => {
        this.showLoggedIn = showLog;
      });
  }

  /**
   * Lifecycle hook per l'OnDestroy
   * Si annullano le iscrizione effettuate agli observable
   */
  ngOnDestroy(): void {
    /**Loader-Spinner */
    if (this.showSpinnerEventListenerSubject) {
      this.showSpinnerEventListenerSubject.unsubscribe();
    }

    /**Animazione Login */
    if (this.showLoggedInEventListenerSubject) {
      this.showLoggedInEventListenerSubject.unsubscribe();
    }
  }
}
