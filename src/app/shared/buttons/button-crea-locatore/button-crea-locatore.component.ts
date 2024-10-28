import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import { LoaderSpinnerService, LocatoriService } from '../../../services';
import { BUTTON_CONSTANT } from '../../../constants';

/**Componente ButtonCreaLocatore */
@Component({
  selector: 'app-button-crea-locatore',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './button-crea-locatore.component.html',
  styleUrl: './button-crea-locatore.component.scss',
})
export class ButtonCreaLocatoreComponent {
  /**Costante button */
  button_constant = BUTTON_CONSTANT;
  /**DialogRef riferimento al dialog*/
  dialogRef: any;
  /** Contiene il form */
  form!: FormGroup;
  /** Emetti quando viene aggiunto un locatore */
  // @Output() locatoreAdded = new EventEmitter<any>();

  /**
   * Il costruttore della classe ButtonCreaCaseComponent
   * @param {LoaderSpinnerService} loaderSpinnerService  Service loaderSpinnerService
   * @param {LocatoriService} locatoriService  Service locatoriService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    private locatoriService: LocatoriService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  /**Apertura del panel per la creazione del locatore */
  openDialog() {}
}
