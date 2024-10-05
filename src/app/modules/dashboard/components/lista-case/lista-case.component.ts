import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import {
  GenericTableService,
  LoaderSpinnerService,
} from '../../../../services';
import { RESULT_CONSTANT, INPUT_CONSTANT } from '../../../../constants';
import { GenericDropDownMenuComponent } from '../../../../shared/generics/generic-drop-down-menu/generic-drop-down-menu.component';
import { GenericTableSearchComponent } from '../../../../shared/generics/generic-table/components/generic-table-search/generic-table-search.component';

/** Componente per la lista delle case */
@Component({
  selector: 'app-lista-case',
  standalone: true,
  templateUrl: './lista-case.component.html',
  styleUrls: ['./lista-case.component.scss'],
  imports: [
    CommonModule,
    GenericTableSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    GenericDropDownMenuComponent,
  ],
})
export default class ListaCaseComponent {
  /** Costante per il risultato vuoto della tabella */
  resultConstant = RESULT_CONSTANT;
  /** Constante per l'input della ricera */
  inputConstant = INPUT_CONSTANT;
  /** Contiene la lista delle zone */
  listaZone: any[] = [];
  /** Stringa contenente il volore della ricerca generica */
  searchValue: string | null = null;
  /** Booleana per lo stato del filtraggio */
  filtering: boolean = false;
  /** Subsciprtion per la lista zone */
  listaZoneSubscription!: Subscription;
  /** Le actions della dropdown */
  actions: any[] = [{}];

  /**
   * Il costruttore della classe, si popola la variabile listaCase con la lista delle case instanziata nel resolver
   * @param {CaseService} caseService L'injectable del service CaseService
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {ActivatedRoute} activatedRoute Fornisce accesso alle informazioni sulla rotta associata a questa componente
   */
  constructor(
    private genericTableService: GenericTableService,
    private loaderSpinnerService: LoaderSpinnerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.listaZone = this.activatedRoute.snapshot.data['listaZone'];
  }

  /**Effettuiamo la sottoscrizione alla funzione updateListaZoneListner e rimaniamo in attesa di cambiamenti
   * Una volta notato il cambiamento si effutua la funzione changePage per aggiornare la lista delle zone
   */
  ngOnInit() {
    // this.listaZoneSubscription = this.zoneService
    //   .updateListaZoneListener()
    //   .subscribe(() => {
    //     this.changePage('');
    //   });
  }

  /**Disiscriviamo */
  ngOnDestroy() {
    if (this.listaZoneSubscription) {
      this.listaZoneSubscription.unsubscribe();
    }
  }
  /**
   * Imposta il valore della variabile searchValue con la stringa inserita dall'utente
   * Se la booleana filtering è a false, viene settata a true e si richiama la funzione changePage
   * @param {any} event Il valore della ricerca
   */
  filterValue(event: any) {
    if (!this.filtering) {
      this.filtering = true;
      this.searchValue = event;
      this.changePage('search');
    }
  }
  /** Esegue la get delle zone con filtraggio */
  changePage(filterFrom: string) {
    this.loaderSpinnerService.show();
    this.genericTableService.emitFiterEvent(filterFrom);
    // this.zoneService
    //   .getListaZone(this.searchValue ? { filtro: this.searchValue } : null)
    //   .subscribe({
    //     next: (res: any) => {
    //       this.listaZone = res;
    //       this.filtering = false;
    //       this.loaderSpinnerService.hide();
    //     },
    //     error: () => this.loaderSpinnerService.hide(),
    //   });
  }
  /** Esegue la navigazione al dettaglio della zona */
  navigate(event: any) {
    // this.zoneService.idZona = event;
    this.router.navigate(['path']);
  }
}
