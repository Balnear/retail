import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrimDirective } from '../../../../../directives';
import { HeaderLabel } from '../../../../../models';
import { AngularMaterialModule } from '../../../../../modules/material-module';



/** Una classe per il componente del header della modale della creazione/modifica dell'esercizio */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, TrimDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /** Il numero di steps */
  @Input() totalSteps!: number;
  /** Le label degli steps */
  @Input() stepsLabels!: string[];
  /** Titolo e sottotitolo della modale */
  @Input() headerLabels!: HeaderLabel;
  /** Variabile per visualizzare titolo e sottotitolo */
  @Input() hasHeaderLabels = true;
  /** Lista degli step */
  @Input() stepsList!: string[];
  /** Lo step attualmente in visualizzazione */
  @Input() currentStep: number = 0;
}


