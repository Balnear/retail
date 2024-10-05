import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../../../material-module';

/** Componente per la lista dei locatori */
@Component({
  selector: 'app-lista-locatori',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './lista-locatori.component.html',
  styleUrl: './lista-locatori.component.scss',
})
export default class ListaLocatoriComponent {}
