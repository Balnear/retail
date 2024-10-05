import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BUTTON_CONSTANT, INPUT_CONSTANT } from '../../../../../constants';
import { AngularMaterialModule } from '../../../../../modules/material-module';
import { GenericTableService } from '../../../../../services/generic-table.service';



/** Una classe per il componente della dropdown della azioni di gruppo sulla tabella */
@Component({
  selector: 'app-generic-table-group-actions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './generic-table-group-actions.component.html',
  styleUrls: ['./generic-table-group-actions.component.scss'],
})
export class GenericTableGroupActionsComponent {
  /** Il tipo di azioni di gruppo */
  @Input() typeActions!: 'default';
  /** Lista di azioni di gruppo */
  @Input() azioniDiGruppo: any[] = [];
  /** Lista dei ruoli */
  @Input() roleOptions: any[] = [];
  /** Indica se abilitare l'applicazione delle azioni di gruppo */
  @Input() enableGroupActions: boolean = false;
  /** Emitter dell'azione di gruppo da applicare */
  @Output() emitApplicaAzioniDiGruppo: EventEmitter<string> =
    new EventEmitter<string>();

  /** Costante delle label dei button */
  buttonConstant = BUTTON_CONSTANT;
  /** Costante delle label degli input */
  inputConstant = INPUT_CONSTANT;
  /** FormControl dell'azione di gruppo selezionata */
  selectAzioneGruppo: FormControl = new FormControl('');

  /**
   *Costruttore
   * @param {GenericTableService} genericTableService l'injectable del service genericTableService
   */
  constructor(private genericTableService: GenericTableService) {}
  /**
   * Reset della select al cambiamento del valore
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.genericTableService.resetFilter == true) {
      this.selectAzioneGruppo.setValue('');
      this.genericTableService.resetFilter =
        !this.genericTableService.resetFilter;
    }
  }
  /** Funzione per l'applicazione delle azioni di gruppo */
  applicaAzioneDiGruppo() {
    this.emitApplicaAzioniDiGruppo.emit(this.selectAzioneGruppo.value);
    if (this.genericTableService.resetFilter == true) {
      this.selectAzioneGruppo.setValue('');
      this.genericTableService.resetFilter =
        !this.genericTableService.resetFilter;
    }
  }
}
