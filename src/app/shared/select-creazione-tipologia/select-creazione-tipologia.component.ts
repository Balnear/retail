import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  ControlContainer,
  FormGroupDirective,
  FormGroup,
} from '@angular/forms';

import { AngularMaterialModule } from '../../modules/material-module';
import {
  LABEL_CONSTANT,
  ERROR_CONSTANT,
  INPUT_CONSTANT,
} from '../../constants';
import { TrimDirective, NoEmojiDirective } from '../../directives';

/**Componente per la creazione di una tipologia */
@Component({
  selector: 'app-select-creazione-tipologia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    TrimDirective,
    NoEmojiDirective,
  ],
  templateUrl: './select-creazione-tipologia.component.html',
  styleUrls: ['./select-creazione-tipologia.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class SelectCreazioneTipologiaComponent {
  /**Form creazione gestore */
  form!: FormGroup;
  /**Costanti gestore */
  labelConstant = LABEL_CONSTANT;
  /** Label per gli errori */
  errorConstant = ERROR_CONSTANT;
  /** Constante per gli input */
  inputConstant = INPUT_CONSTANT;

  /**
   * Il costruttore della classe FormCreazioneTipologiaComponent
   *  @param {FormGroupDirective} parentF richiamo del form padre
   */
  constructor(private parentF: FormGroupDirective) {}

  /**LifeCycle onInit si popola il form */
  ngOnInit() {
    this.form = this.parentF.form;
  }
}
