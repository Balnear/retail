import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/** Componente per la gestione dei locatori */
@Component({
  selector: 'app-locatori',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './locatori.component.html',
  styleUrl: './locatori.component.scss',
})
export default class LocatoriComponent {}
