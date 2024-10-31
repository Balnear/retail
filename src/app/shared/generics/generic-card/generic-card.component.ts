import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { AngularMaterialModule } from '../../../modules/material-module';
import { ICON_CONSTANT } from '../../../constants';

/**Componente per la card dei locatori */
@Component({
  selector: 'app-generic-card',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './generic-card.component.html',
  styleUrl: './generic-card.component.scss',
})
export class GenericCardComponent {
  /** Costante per il nome delle icone */
  iconConstant: any = ICON_CONSTANT;
  /** I dati da far visualizzare nella card */
  @Input() data!: any;
  /**Accetta un array di azioni */
  @Input() actions: any[] = [];

  /** Funzione che restituisce la classe CSS in base all'attività del locatore */
  getStatusClass(activity: string) {
    switch (activity) {
      case 'Online':
        return 'on-green';
      case 'Offline':
        return 'of-red';
      default:
        return '';
    }
  }
}
