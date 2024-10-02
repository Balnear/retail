import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICON_CONSTANT } from '../../../constants';
import { AngularMaterialModule } from '../../../modules/material-module';



/**Componente generic-drop-down-menù */
@Component({
  selector: 'app-generic-drop-down-menu',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './generic-drop-down-menu.component.html',
  styleUrls: ['./generic-drop-down-menu.component.scss'],
})
export class GenericDropDownMenuComponent {
  /** Richiamo la ICON_CONSTANT */
  iconConstant = ICON_CONSTANT;
  /** Le actions della dropdown */
  @Input() actions: any[] = [];
  /** L'action della dropdown */
  @Input() action: any[] = [];
}
