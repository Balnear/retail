import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AngularMaterialModule } from '../../modules/material-module';
import {
  CaseService,
  LoaderSpinnerService,
  LocatoriService,
  PanelService,
} from '../../services';
import {
  LABEL_CONSTANT,
  ICON_CONSTANT,
  RESULT_CONSTANT,
} from '../../constants';
import { GenericCardComponent, GenericDetailModalComponent } from '../generics';
import {
  DettaglioCasaLocatoreComponent,
  HeaderCasaLocatoreComponent,
} from '..';

/**Componente per il dettaglio del locatore */
@Component({
  selector: 'app-dettaglio-locatore',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, GenericCardComponent],
  templateUrl: './dettaglio-locatore.component.html',
  styleUrl: './dettaglio-locatore.component.scss',
})
export class DettaglioLocatoreComponent implements OnInit {
  /** Richiamo le costanti da labelCostant */
  labelConstant = LABEL_CONSTANT;
  /** Richiamo la ICON_CONSTANT */
  iconConstant = ICON_CONSTANT;
  /** Costante per il risultato vuoto della tabella */
  resultConstant = RESULT_CONSTANT;
  /** I dati del locatore */
  data!: any;
  /** Le case assegnate al locatore */
  caseLocatore: any[] = [];

  /**
   * Il costruttore della classe.
   * @param {LocatoriService} locatoriService - Injectable del service LocatoriService per gestire le operazioni sui locatori.
   * @param {CaseService} caseService - Injectable del service CaseService per gestire le operazioni sulle case.
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {PanelService} panelService L'injectable del service pannello
   */
  constructor(
    private locatoriService: LocatoriService,
    private caseService: CaseService,
    private loaderSpinnerService: LoaderSpinnerService,
    private panelService: PanelService
  ) {
    this.data = this.locatoriService.dettaglioLocatore;
  }

  /**LifeCycle onInit si popolano le case del locatore */
  ngOnInit() {
    this.visualizzaCaseLocatore(this.data.displayName);
  }

  /**Mostra le case associate al locatore */
  visualizzaCaseLocatore(nome: any) {
    this.caseService.getAllCase(nome).subscribe({
      next: (res) => {
        this.caseLocatore = res;
        console.log(this.caseLocatore);
      },
      error: (err) => {
        err.message;
      },
    });
  }

  /**Funzione che restituisce l'icona in base allo stato */
  getStatusIcon(status: string) {
    switch (status) {
      case 'Online':
        return this.iconConstant.check_circle;
      case 'Offline':
        return this.iconConstant.cancel;
      default:
        return '';
    }
  }

  /**Metodo per visualizzare il dettaglio della casa associata al locatore */
  dettaglioCasaLocatore = (casa: any) => {
    this.loaderSpinnerService.show();
    this.caseService.getCasa(casa.id).subscribe({
      next: (res) => {
        this.loaderSpinnerService.hide();
        this.caseService.dettaglioCasa = res;
        this.panelService.open(GenericDetailModalComponent, {
          backdropClass: 'custom-backdrop',
          panelClass: 'custom-subpanel',
          type: 'sub-panel',
          headComponent: HeaderCasaLocatoreComponent,
          components: [DettaglioCasaLocatoreComponent],
        });
      },
    });
  };
}
