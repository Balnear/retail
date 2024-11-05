import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../../material-module';
import {
  LocatoriService,
  LoaderSpinnerService,
  PanelService,
} from '../../../../services';
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
  /**Lista dei locatori */
  locatori: any;

  /**
   * Il costruttore della classe, si popola la variabile listaLocatori con la lista dei locatori
   * @param {LocatoriService} locatoriService L'injectable del service LocatoriService
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {PanelService} panelService L'injectable del service pannello
   * @param {MatDialog} dialog L'injectable del token
   * @param {FormBuilder} fb L'injectable del FormBuilder
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
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
      },
    });
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
