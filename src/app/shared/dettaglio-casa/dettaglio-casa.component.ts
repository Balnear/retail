import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AngularMaterialModule } from '../../modules/material-module';
import { CaseService } from '../../services';
import { ICON_CONSTANT, LABEL_CONSTANT } from '../../constants';

/**Componente per il dettaglio della casa */
@Component({
  selector: 'app-dettaglio-casa',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './dettaglio-casa.component.html',
  styleUrl: './dettaglio-casa.component.scss',
})
export class DettaglioCasaComponent {
  /** Richiamo le costanti da labelCostant */
  labelConstant = LABEL_CONSTANT;
  /** Richiamo la ICON_CONSTANT */
  iconConstant = ICON_CONSTANT;
  /** I dati della casa */
  data!: any;
  /** I dati del locatore */
  locatore!: any;
  /** I dati delle caratteristiche */
  caratteristiche!: any;
  /** I dati dei costi */
  costi!: any;
  /**
   * Il costruttore della classe.
   * @param {CaseService} caseService - Injectable del service CaseService per gestire le operazioni sulle case.
   */
  constructor(private caseService: CaseService) {
    this.data = this.caseService.dettaglioCasa;
    console.log(this.data, 'data');

    this.locatore = this.data.locatore.mapValue.fields;
    this.caratteristiche = this.data.caratteristiche.mapValue.fields;
    this.costi = this.data.costi.mapValue.fields;
  }

  /** Funzione che restituisce la classe CSS in base allo stato */
  getStatusClass(statoAffitto: string) {
    switch (statoAffitto) {
      case 'LIBERO':
        return 'chip-green';
      case 'IN SCADENZA':
        return 'chip-orange';
      case 'OCCUPATO':
        return 'chip-red';
      default:
        return '';
    }
  }

  /**Funzione che restituisce l'icona in base allo stato */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'LIBERO':
        return this.iconConstant.done;
      case 'IN SCADENZA':
        return this.iconConstant.warning;
      case 'OCCUPATO':
        return this.iconConstant.block;
      default:
        return '';
    }
  }

  /** Funzione che restituisce la classe CSS in base allo stato */
  getStatusClassManutenzione(statoManutenzione: string) {
    switch (statoManutenzione) {
      case 'BUONO':
        return 'chip-orange';
      case 'DA RISTRUTTURARE':
        return 'chip-red';
      case 'NUOVO':
        return 'chip-green';
      default:
        return '';
    }
  }

  /**Funzione che restituisce l'icona in base allo stato */
  getStatusIconManutenzione(status: string): string {
    switch (status) {
      case 'BUONO':
        return this.iconConstant.emergency_home;
      case 'DA RISTRUTTURARE':
        return this.iconConstant.construction;
      case 'NUOVO':
        return this.iconConstant.energy_savings_leaf;
      default:
        return '';
    }
  }
}
