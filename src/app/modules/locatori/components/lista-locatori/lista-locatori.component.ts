import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../../material-module';
import { LocatoriService, LoaderSpinnerService } from '../../../../services';
import { GenericCardComponent } from '../../../../shared';

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
  /** Le actions della dropdown */
  actions: any[] = [
    {
      label: 'Dettaglio',
      icon: 'arrow_forward',
      actionFunction: (r: any) => this.dettaglioLocatore(r.id),
    },
  ];

  /**
   * Il costruttore della classe, si popola la variabile listaCase con la lista delle case instanziata nel resolver
   * @param {CaseService} caseService L'injectable del service CaseService
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {PanelService} panelService L'injectable del service pannello
   * @param {MatDialog} dialog L'injectable del token
   * @param {FormBuilder} fb L'injectable del FormBuilder
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private locatoriService: LocatoriService,
    private loaderSpinnerService: LoaderSpinnerService
  ) {}

  /** Lifecycle hook dell'onInit, */
  ngOnInit() {
    this.locatoriService.getAllLocatori().subscribe({
      next: (users: any) => (this.locatori = users),
      error: (err) =>
        console.error('Errore nel recupero degli utenti Locatore:', err),
    });
  }
  /**Metodo per visualizzare il dettaglio del locatore */
  dettaglioLocatore(id: string) {
    this.loaderSpinnerService.show();
    this.locatoriService.getLocatore(id).subscribe({
      next: (res) => {
        // const obj = res._document.data.value.mapValue.fields;
        // this.locatoriService.dettaglioLocatore = obj;
        // this.loaderSpinnerService.hide();
        // this.panelService.open(GenericDetailModalComponent, {
        //   backdropClass: 'custom-backdrop',
        //   panelClass: 'custom-panel',
        //   type: 'panel',
        //   headComponent: HeaderLocatoreComponent,
        //   components: [DettaglioLocatoreComponent],
        // });
      },
    });
  }
}
