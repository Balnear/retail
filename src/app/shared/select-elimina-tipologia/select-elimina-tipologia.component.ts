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
import { CaseService } from '../../services/case.service';
import {
  LABEL_CONSTANT,
  ERROR_CONSTANT,
  INPUT_CONSTANT,
} from '../../constants';
import { TrimDirective, NoEmojiDirective } from '../../directives';

/**Componente per l'eliminazione di una tipologia */
@Component({
  selector: 'app-select-elimina-tipologia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    TrimDirective,
    NoEmojiDirective,
  ],
  templateUrl: './select-elimina-tipologia.component.html',
  styleUrls: ['./select-elimina-tipologia.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class SelectEliminaTipologiaComponent {
  /**Form creazione gestore */
  form!: FormGroup;
  /**Costanti gestore */
  labelConstant = LABEL_CONSTANT;
  /** Label per gli errori */
  errorConstant = ERROR_CONSTANT;
  /** Constante per gli input */
  inputConstant = INPUT_CONSTANT;
  /** Tipologia delle case */
  tipologieCase!: string[];

  /**
   * Il costruttore della classe FormEliminaTipologiaComponent
   * @param {CaseService} caseService L'injectable del service caseService
   * @param {FormGroupDirective} parentF richiamo del form padre
   */
  constructor(
    private caseService: CaseService,
    private parentF: FormGroupDirective
  ) {}
  /**LifeCycle onInit si popola il form */
  ngOnInit() {
    this.form = this.parentF.form;
    this.tipologieCase = this.caseService.tipologie;
  }
}
