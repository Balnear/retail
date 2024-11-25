import { Component } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../../modules/material-module';
import { LocatoriService } from '../../services';
import {
  LABEL_CONSTANT,
  ERROR_CONSTANT,
  INPUT_CONSTANT,
} from '../../constants';

/**Componente per la select dei locatori */
@Component({
  selector: 'app-select-elimina-profilo-locatore',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './select-elimina-profilo-locatore.component.html',
  styleUrls: ['./select-elimina-profilo-locatore.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class SelectEliminaProfiloLocatoreComponent {
  /**Form elimina profilo locatore */
  form!: FormGroup;
  /**Costanti gestore */
  labelConstant = LABEL_CONSTANT;
  /** Label per gli errori */
  errorConstant = ERROR_CONSTANT;
  /** Constante per gli input */
  inputConstant = INPUT_CONSTANT;
  /** Tipologia delle case */
  listaLocatori!: any;

  /**
   * Il costruttore della classe FormEliminaTipologiaComponent
   * @param {LocatoriService} locatoriService L'injectable del service locatoriService
   * @param {FormGroupDirective} parentF richiamo del form padre
   */
  constructor(
    private locatoriService: LocatoriService,
    private parentF: FormGroupDirective
  ) {}
  /**LifeCycle onInit si popola il form */
  ngOnInit() {
    this.form = this.parentF.form;
    this.listaLocatori = this.locatoriService.locatori;
  }
}
