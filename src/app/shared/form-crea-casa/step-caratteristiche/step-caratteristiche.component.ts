import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlContainer,
  FormGroupDirective,
  FormGroup,
} from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import {
  INPUT_CONSTANT,
  LABEL_CONSTANT,
  ERROR_CONSTANT,
} from '../../../constants';
import { NoEmojiDirective, TrimDirective } from '../../../directives';

/** Componente per lo step delle caratteristiche */
@Component({
  selector: 'app-step-caratteristiche',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './step-caratteristiche.component.html',
  styleUrls: ['./step-caratteristiche.component.scss'],
  providers: [
    NoEmojiDirective,
    TrimDirective,
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class StepCaratteristicheComponent {
  /** Riferimento al form */
  form!: FormGroup;
  /** Constante per le label degli input */
  inputConstant = INPUT_CONSTANT;
  /** Constante per le label */
  labelConstant = LABEL_CONSTANT;
  /** Constante per gli errori */
  errorConstant = ERROR_CONSTANT;
  /**Numero dei piani della casa */
  altezzaPiano = ['Piano-terra', 'Primo-piano', 'Secondo-piano', 'Terzo-piano'];
  /**Tipo di riscaldamento */
  riscaldamento = ['Autonomo', 'Centralizzato'];

  /**
   * Il costruttore della classe
   * @param {FormGroupDirecrive} parentF Direttiva di accesso al form contenente nel padre
   */
  constructor(private parentF: FormGroupDirective) {
    this.form = parentF.form;
  }
  ngOnInit() {
    this.form = this.parentF.form;
  }
}
