import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/** Componente per la gestione dei locatori */
@Component({
  selector: 'app-lista-locatori',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './lista-locatori.component.html',
  styleUrls: ['./lista-locatori.component.scss'],
})
export default class ListaLocatoriComponent {}
