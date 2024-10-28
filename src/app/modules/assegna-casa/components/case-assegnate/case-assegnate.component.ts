import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Component per la gestione degli immobili assegnati
 */
@Component({
  selector: 'app-case-assegnate',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './case-assegnate.component.html',
  styleUrls: ['./case-assegnate.component.scss'],
})
export default class CaseAssegnateComponent {}
