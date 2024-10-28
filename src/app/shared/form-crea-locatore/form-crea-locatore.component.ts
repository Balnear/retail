import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { AngularMaterialModule } from '../../modules/material-module';
import {
  HINT_CONSTANT,
  INPUT_CONSTANT,
  LABEL_CONSTANT,
  ERROR_CONSTANT,
  ICON_CONSTANT,
} from '../../constants';

/**Componente per la creazione del locatore */
@Component({
  selector: 'app-form-crea-locatore',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './form-crea-locatore.component.html',
  styleUrls: ['./form-crea-locatore.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormCreaLocatoreComponent {
  /** Costante per i messaggi di suggerimento */
  hintConstant = HINT_CONSTANT;
  /** Constante per le label degli input */
  inputConstant = INPUT_CONSTANT;
  /** Constante per le label */
  labelConstant = LABEL_CONSTANT;
  /** Constante per gli errori */
  errorConstant = ERROR_CONSTANT;
  /** Constante per le icone */
  iconConstant = ICON_CONSTANT;
  /**Form creazione locatore */
  form!: FormGroup;
  /**Tipologia di utente */
  tipologieUser = ['Locatore', 'Inquilino'];
  /** Indica se la password deve essere mostrata in chiaro */
  passwordHide = true;
  /** Indica se il repeatPassword deve essere mostrato in chiaro */
  repeatPasswordHide = true;

  constructor(private parentF: FormGroupDirective) {}

  ngOnInit() {
    this.form = this.parentF.form;
  }
}
