import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { AngularMaterialModule } from '../../../modules/material-module';
import {
  BUTTON_CONSTANT,
  ICON_CONSTANT,
  LABEL_CONSTANT,
} from '../../../constants';
import { LocatoriService } from '../../../services';

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
  /** Constante per i bottoni */
  buttonConstant = BUTTON_CONSTANT;
  /** I dati da far visualizzare nella card */
  @Input() data!: any;
  /**Callback passata dal componente padre */
  @Input() actionCallback!: (locatore: any) => void;

  /**
   * Il costruttore della classe
   */
  constructor() {}

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

  /**Metodo per chiamare il metodo del padre con data */
  onActionClick() {
    if (this.actionCallback) {
      this.actionCallback(this.data);
    }
  }
}
