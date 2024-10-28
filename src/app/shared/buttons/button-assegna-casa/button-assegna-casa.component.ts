import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import {
  LoaderSpinnerService,
  CaseAssegnateService,
  CaseService,
} from '../../../services';
import { BUTTON_CONSTANT } from '../../../constants';

/**Componente ButtonAssegnaCasa */
@Component({
  selector: 'app-button-assegna-casa',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './button-assegna-casa.component.html',
  styleUrl: './button-assegna-casa.component.scss',
})
export class ButtonAssegnaCasaComponent {
  /**Costante button */
  button_constant = BUTTON_CONSTANT;
  /**DialogRef riferimento al dialog*/
  dialogRef: any;
  /** Contiene il form */
  form!: FormGroup;
  /**Dati della casa */
  data!: any;
  /** Emetti quando viene assegnata una casa */
  // @Output() casaAssegnataAdded = new EventEmitter<any>();

  /**
   * Il costruttore della classe ButtonCreaCaseComponent
   * @param {LoaderSpinnerService} loaderSpinnerService  Service loaderSpinnerService
   * @param {CaseAssegnateService} caseAssegnateService  Service caseAssegnateService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    private caseAssegnateService: CaseAssegnateService,
    private caseService: CaseService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  /** Lifecycle hook dell'onInit */
  ngOnInit() {
    if (this.caseService.idAssegnato) {
      this.data = this.caseService.dettaglioCasa;
    } else {
      this.data = null;
    }
  }

  /**Apertura del panel per assegnare la casa ad uno o più inquilini tramite la casa della dashboard */
  openDialogId(id: string) {
    console.log('con id');

    this.data = null;
    this.caseService.idAssegnato = false;
  }

  /**Apertura del panel per assegnare la casa in modo generico */
  openDialog() {
    console.log('generale');
  }
}
