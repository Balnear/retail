import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import { InquiliniService, LoaderSpinnerService } from '../../../services';
import { BUTTON_CONSTANT } from '../../../constants';

/**Componente ButtonCreaInquilino */
@Component({
  selector: 'app-button-crea-inquilino',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './button-crea-inquilino.component.html',
  styleUrl: './button-crea-inquilino.component.scss',
})
export class ButtonCreaInquilinoComponent {
  /**Costante button */
  button_constant = BUTTON_CONSTANT;
  /**DialogRef riferimento al dialog*/
  dialogRef: any;
  /** Contiene il form */
  form!: FormGroup;
  /** Emetti quando viene aggiunto un inquilino */
  // @Output() inquilinoAdded = new EventEmitter<any>();

  /**
   * Il costruttore della classe ButtonCreaCaseComponent
   * @param {LoaderSpinnerService} loaderSpinnerService  Service loaderSpinnerService
   * @param {InquiliniService} inquiliniService  Service inquiliniService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    private inquiliniService: InquiliniService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  /**Apertura del panel per la creazione del inquilino */
  openDialog() {}
}
