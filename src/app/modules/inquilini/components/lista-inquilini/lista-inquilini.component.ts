import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../../material-module';

/**Componente per la gestione della lista degli inquilini */
@Component({
  selector: 'app-lista-inquilini',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './lista-inquilini.component.html',
  styleUrl: './lista-inquilini.component.scss',
})
export default class ListaInquiliniComponent {}
