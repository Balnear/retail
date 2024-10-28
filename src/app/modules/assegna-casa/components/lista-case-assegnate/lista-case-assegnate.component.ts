import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AngularMaterialModule } from '../../../material-module';

/**Componente per la gestione della lista case assegnate ad uno o piu inquilini */
@Component({
  selector: 'app-lista-case-assegnate',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './lista-case-assegnate.component.html',
  styleUrl: './lista-case-assegnate.component.scss',
})
export default class ListaCaseAssegnateComponent {}
