import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import {
  ICON_CONSTANT,
  INPUT_CONSTANT,
  LABEL_CONSTANT,
} from '../../../constants';
import { CaseService } from '../../../services/case.service';
import { GenericStepperModal } from '../../generics';

/** Componente per lo step di riepilogo */
@Component({
  selector: 'app-step-riepilogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './step-riepilogo.component.html',
  styleUrls: ['./step-riepilogo.component.scss'],
  providers: [
    KeyValuePipe,
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class StepRiepilogoComponent {
  /** Constante per le label degli input */
  inputConstant = INPUT_CONSTANT;
  /** Costante per le label generiche */
  labelConstant = LABEL_CONSTANT;
  /** Costante per le label delle icone */
  iconConstant = ICON_CONSTANT;
  /** Riferimento al valore del form */
  formValue!: any;

  /**
   * Il costruttore della classe
   * @param {CaseService} caseService L'injectable del service caseService
   * @param {GenericStepperModal} genericStepperModal Accesso alla componente dello stepper
   * @param {FormGroupDirecrive} parentF Direttiva di accesso al form contenente nel padre
   */
  constructor(
    public caseService: CaseService,
    private genericStepperModal: GenericStepperModal,
    private parentF: FormGroupDirective
  ) {
    this.formValue = parentF.form.value;
  }

  /** Lifecyclehook dell'onInit */
  ngOnInit() {
    console.log(this.formValue, 'formvalue');
  }

  /**
   * Cambio di step per la modifica delle informazioni
   * @param {number} step lo step a cui rimandare
   */
  changeStep(step: number) {
    this.genericStepperModal.changeStep(step);
  }
}
