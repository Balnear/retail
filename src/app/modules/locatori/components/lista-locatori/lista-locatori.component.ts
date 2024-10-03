import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../../material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-locatori',
  standalone: true,
  imports: [CommonModule,AngularMaterialModule],
  templateUrl: './lista-locatori.component.html',
  styleUrl: './lista-locatori.component.scss'
})
export default class ListaLocatoriComponent {

}
