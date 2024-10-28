import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Component per la gestione degli immobili
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterModule],
})
export default class DashboardComponent {}
