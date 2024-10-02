import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TABLE_INPUT_CONSTANT } from '../../../../../constants';
import { AngularMaterialModule } from '../../../../../modules/material-module';
import { GenericTableService } from '../../../../../services/generic-table.service';



/** Componente per la singola cella dell'head della tabella */
@Component({
  selector: 'app-generic-head-cell',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './generic-head-cell.component.html',
  styleUrls: ['./generic-head-cell.component.scss'],
})
export class GenericHeadCellComponent {
  /** Il tipo di cella del head */
  @Input() type!: string;
  /** La colonna del head */
  @Input() col!: string;
  /** indica se la cella è di dimensioni ridotte */
  @Input() small: boolean = false;
  /** Il valore del sort sulla singola cella */
  @Input() sorted: boolean = false;
  /** Se la checkbox è selezionata*/
  @Input() selected: any[] = [];
  /** Numero tabella */
  @Input() numeroTabella!: number;
  /** Indica se tutte le righe sono selezionate */
  @Input() isAllSelected: boolean = false;
  /** Emette l'evento di sort */
  @Output() emitSortEvent: EventEmitter<any> = new EventEmitter<any>();
  /** Emitter dell'evento di selezione di tutte le righe */
  @Output() emitSelectAll: EventEmitter<void> = new EventEmitter<void>();
  /** Costante per la formattazione delle colonne della tabella */
  tableConstant: any = TABLE_INPUT_CONSTANT;

  /**
   * Il costruttore della classe
   * @param {GenericTableService} genericTableService L'injectable del service GenericTableService
   */
  constructor(private genericTableService: GenericTableService) {}

  /** Effettua il sort della colonna */
  sortCol() {
    this.sorted = !this.sorted;
    this.emitSortEvent.emit({
      col: this.col,
      value: this.sorted ? 'ASC' : 'DESC',
    });
    this.genericTableService.emitFiterEvent('sort')
  }

  /** Emette l'evento che tutte le righe devono essere selezionate/deselezionate */
  masterToggle() {
    this.genericTableService.emitCheckAll({
      isAllSelected: !this.isAllSelected,
      numeroTabella: this.numeroTabella,
    });
    this.emitSelectAll.emit();
  }
}
