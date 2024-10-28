import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**Componente per gestire gli inquilini */
@Component({
  selector: 'app-inquilini',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './inquilini.component.html',
  styleUrls: ['./inquilini.component.scss'],
})
export default class InquiliniComponent {}
