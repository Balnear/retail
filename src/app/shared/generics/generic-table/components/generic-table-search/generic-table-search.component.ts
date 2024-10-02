import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { AngularMaterialModule } from '../../../../../modules/material-module';
import { GenericTableService } from '../../../../../services/generic-table.service';

/** Componente per l'input di ricerca */
@Component({
  selector: 'app-generic-table-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './generic-table-search.component.html',
  styleUrls: ['./generic-table-search.component.scss'],
})
export class GenericTableSearchComponent {
  /** Emitter dell'evento di ricerca */
  @Output() emitSearchValue: EventEmitter<any> = new EventEmitter<any>();
  /** Label per il campo di ricerca */
  @Input() inputLabel: string = '';
  /** Il FormControl del campo di ricerca */
  searchValue: FormControl = new FormControl('');
  /** Precedente filtraggio */
  previousFilter: string = '';
  /** Subscription per l'evento di reset del filtraggio */
  filterSubscription!: Subscription;

  /**
   * Il costruttore della classe
   * @param {GenericTableService} genericTableService L'injectable del service GenericTableService
   */
  constructor(private genericTableService: GenericTableService) {}

  /** Effettua la sottoscrizione all'observable restando in ascolto del filtraggio negli altri filtri della tabella */
  ngOnInit() {
    this.filterSubscription = this.genericTableService
      .emitFiterListener()
      .subscribe((res) => {
        if (res !== 'search') this.searchValue.setValue('');
      });
  }

  /** Effettua l'unsubscribe */
  ngOnDestroy() {
    if (this.filterSubscription) this.filterSubscription.unsubscribe;
  }
  /** Resta in attesa del click sull'icona X dell'input type search e fa l'emit della cancellazione */
  @HostListener('search', ['$event']) onDelete() {
    this.emitSearchValue.emit(null);
  }

  /** Emette l'evento di ricerca */
  changePage() {
    if (this.previousFilter !== this.searchValue.value) {
      this.previousFilter = this.searchValue.value;
      this.emitSearchValue.emit(this.searchValue.value);
      this.genericTableService.emitFiterEvent('search');
    }
  }
}
