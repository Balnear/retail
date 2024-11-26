import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../../material-module';
import { FormsModule } from '@angular/forms';
import { GenericCardComponent } from '../../../../shared';
import { LocatoriService, LoaderSpinnerService, PanelService, InquiliniService } from '../../../../services';

/**Componente per la gestione della lista degli inquilini */
@Component({
  selector: 'app-lista-inquilini',
  standalone: true,
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './lista-inquilini.component.html',
  styleUrls: ['./lista-inquilini.component.scss'],
})
export default class ListaInquiliniComponent {
   
}
