import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { AngularMaterialModule } from '../../../modules/material-module';
import { BUTTON_CONSTANT, ICON_CONSTANT } from '../../../constants';

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
  @Input() actionCallback!: (res: any) => void;
  /**Booleana per la lista dei locatori */
  @Input() locatore: boolean = false;
  /**Booleana per la lista delle case assegnate al locatore */
  @Input() caseLocatore: boolean = false;
  /**Numero di immagini disponibili in `assets/case` */
  @Input() totalImages: number = 10;
  /**Percorso immagine casuale che verrà mostrato nel card */
  randomImageUrl: string = '';

  /**
   * Il costruttore della classe
   */
  constructor() {}

  ngOnInit() {
    // Genera immagine casuale all'avvio
    this.randomImageUrl = this.getRandomImagePath();
  }

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

  /**Funzione per ottenere un percorso immagine casuale */
  private getRandomImagePath(): string {
    const randomIndex = Math.floor(Math.random() * this.totalImages) + 1;
    return `assets/case/casa${randomIndex}.jpg`;
  }
}
