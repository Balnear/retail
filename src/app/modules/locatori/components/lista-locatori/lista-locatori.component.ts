import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../../material-module';
import {
  LocatoriService,
  LoaderSpinnerService,
  PanelService,
} from '../../../../services';
import { INPUT_CONSTANT, RESULT_CONSTANT } from '../../../../constants';
import {
  DettaglioLocatoreComponent,
  GenericCardComponent,
  GenericDetailModalComponent,
  HeaderLocatoreComponent,
} from '../../../../shared';

/** Componente per la gestione dei locatori */
@Component({
  selector: 'app-lista-locatori',
  standalone: true,
  imports: [
    AngularMaterialModule,
    GenericCardComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './lista-locatori.component.html',
  styleUrls: ['./lista-locatori.component.scss'],
})
export default class ListaLocatoriComponent {
  /** Costante per il risultato vuoto della tabella */
  resultConstant = RESULT_CONSTANT;
  /** Constante per l'input della ricera */
  inputConstant = INPUT_CONSTANT;
  /**Lista dei locatori */
  locatori: any;
  /**Lista filtrata dei locatori */
  filteredLocatori: any[] = [];
  /**Testo di ricerca */
  searchTerm: string = '';

  /**
   * Il costruttore della classe, si popola la variabile listaLocatori con la lista dei locatori
   * @param {LocatoriService} locatoriService L'injectable del service LocatoriService
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {PanelService} panelService L'injectable del service pannello
   */
  constructor(
    private locatoriService: LocatoriService,
    private loaderSpinnerService: LoaderSpinnerService,
    private panelService: PanelService
  ) {}

  /** Lifecycle hook dell'onInit, */
  ngOnInit() {
    this.locatoriService.getAllLocatori().subscribe({
      next: (users: any) => {
        this.locatori = users;
        this.filteredLocatori = [...this.locatori];
        this.locatoriService.locatori = users;
      },
    });
  }

  /**Metodo per aggiornare la lista filtrata */
  ngOnChanges(): void {
    this.filterLocatori();
  }

  /**Metodo per il filtraggio della lista */
  filterLocatori(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (term === '') {
      // Se il campo di ricerca è vuoto, mostra l'intera lista
      this.filteredLocatori = [...this.locatori];
    } else {
      // Filtra la lista basandosi sul valore di ricerca
      this.filteredLocatori = this.locatori.filter(
        (locatore: { displayName: string }) =>
          locatore.displayName.toLowerCase().includes(term)
      );
    }
  }

  /**Metodo per visualizzare il dettaglio del locatore */
  dettaglioLocatore = (locatore: any) => {
    this.loaderSpinnerService.show();
    this.locatoriService.getLocatore(locatore.uid).subscribe({
      next: (res) => {
        this.loaderSpinnerService.hide();
        this.locatoriService.dettaglioLocatore = res;
        this.panelService.open(GenericDetailModalComponent, {
          backdropClass: 'custom-backdrop',
          panelClass: 'custom-panel',
          type: 'panel',
          headComponent: HeaderLocatoreComponent,
          components: [DettaglioLocatoreComponent],
        });
      },
    });
  };
}
