import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatPaginatorIntl } from '@angular/material/paginator';


import {
  GenericHeadCellComponent,
  GenericBodyCellComponent,
  GenericTableSearchComponent,
  GenericTableSelectComponent,
} from './components';
import { GenericTableGroupActionsComponent } from './components/generic-table-group-actions/generic-table-group-actions.component';
import { SelectionModel } from '@angular/cdk/collections';
import { INPUT_CONSTANT, RESULT_CONSTANT, TABLE_GROUP_ACTIONS_CONSTANT, LABEL_CONSTANT } from '../../../constants';
import { AngularMaterialModule } from '../../../modules/material-module';
import { GenericTableService } from '../../../services/generic-table.service';
import { PanelService } from '../../../services/panel.service';

/** Componente per la tabella dinamica  */
@Component({
  selector: 'app-generic-table',
  standalone: true,
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      // useClass: MatPaginatorIntlIta,
    },
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    GenericHeadCellComponent,
    GenericBodyCellComponent,
    GenericTableGroupActionsComponent,
    GenericTableSearchComponent,
    GenericTableSelectComponent,
  ],
})
export class GenericTableComponent {
  /** Constante per gli input label */
  inputConstant = INPUT_CONSTANT;
  /** La sorgente dei dati da inserire nella tabella */
  @Input() dataSource: any;
  /** La lista delle colonne su cui costruire la tabellaa */
  @Input() displayedColumns!: string[];
  /** Variabile per il messaggio da visualizzare quando non ci sono elementi in tabella */
  @Input() noItemsMessage: string = RESULT_CONSTANT.nessun_risultato;
  /** indica se la deve visualizzare il paginator */
  @Input() isHide: boolean = false;
  /** indica se la cella è di dimensioni ridotte */
  @Input() small: boolean = false;
  /** Un oggetto con la tipologia per ogni cella dell'header, se nessuna coppia chiave-valore per una colonna è inserita viene usata la tipologia 'label'. Tipologie possibile:
   * sort: la cella contiene la freccia del sort
   * Esempio:
   *   cellHeadTypes = {
   *       col: 'sort'
   *       col3: 'sort',
   *       col4: 'sort',
   * };
   */
  @Input() cellHeadTypes!: any;
  /** Il tipo di celle del body */
  @Input() cellBodyTypes!: any;
  /** Se sopra la tabella ci sta il form di ricerca o la selezione di azioni di gruppo applicabili */
  @Input() hasSearch?: boolean;
  /** Se sopra la tabella ci sta il form di ricerca con l'id */
  @Input() hasSearchId?: boolean;
  /** Se sopra la tabella ci sta il form di ricerca con il grower */
  @Input() hasSearchGrower?: boolean;
  /** Se sopra la tabella ci sta il form di ricerca con la coltura */
  @Input() hasSearchColtura?: boolean;
  /** Se sopra la tabella c'è la select per il filtraggio */
  @Input() hasSelect: boolean = false;
  /** Se sopra la tabella c'è il bottone del download */
  @Input() hasDownload: boolean = false;
  /** Se sopra la tabella c'è la select le azioni di gruppo */
  @Input() hasGroupActions: boolean = false;
  /** Se sopra la tabella c'è la select e il search non li visualizza*/
  @Input() notHasSelectSearch: boolean = false;
  /** Le option contenute all'interno della select */
  @Input() selectOptions: string[] = [];
  /** La label della select */
  @Input() selectLabel: string = '';
  /** La label del search input */
  @Input() inputLabel: string = INPUT_CONSTANT.nome;
  /** Il size della singola pagina della tabella */
  @Input() size!: number;
  /** Il numero totale di tutti gli elementi della lista */
  @Input() totalElements!: number;
  /** L'indice della pagina attuale della Tabella */
  @Input() pageIndex!: number;
  /** Oggetto contenente il nome della colonna e il valore del sort */
  @Input() sortedItems!: any;
  /** Opzioni per la dropdown Azioni di gruppo, se nessuna opzione viene passata, la dropdown si valorizza con la costante TABLE_GROUP_ACTIONS_CONSTANT */
  @Input() azioniDiGruppo: any = TABLE_GROUP_ACTIONS_CONSTANT;
  /** Emette l'evento di selezione del valore all'interno della select */
  @Output() emitSelectedOption: EventEmitter<any> = new EventEmitter<any>();
  /** Emette l'evento di cambio pagina o per navigazione tra le pagine o per una ricerca effettuata su tutta la lista */
  @Output() emitChangePage: EventEmitter<any> = new EventEmitter<any>();
  /** Emette l'evento di emit di ricerca sulla tabella */
  @Output() emitSearchEvent: EventEmitter<any> = new EventEmitter<any>();
  /** Emette l'evento di applicazione azione di gruppo */
  @Output() emitApplicaAzioniDiGruppo: EventEmitter<any> =
    new EventEmitter<any>();
  /** Emette l'evento per il button di conferma, ritorna la lista delle righe selezionate in tabella */
  @Output() emitSelectedElements: EventEmitter<any> = new EventEmitter<any>();
  /** Costante per le label */
  labelConstant: any = LABEL_CONSTANT;
  /** Indica se è in corso un filtraggio o una ricerca */
  isFiltering: boolean = false;
  /** Subscription all'observable dell'evento di fine filtraggio/ricerca */
  updateFilteringStatusSubscription!: Subscription;
  /** Subscription all'observable dell'evento di distruzione tabella */
  tableDestroySubscription!: Subscription;
  /** Numero tabella */
  numeroTabella!: number;
  /** Termine di ricerca */
  searchValue: string | null = null;
  /** Il template della griglia della tabella */
  gridTemplate!: string;
  /** Lista degli elementi selezionati */
  selection = new SelectionModel<any>(true, []);

  /**
   * Il costruttore della classe.
   * @param {GenericTableService} genericTableService L'injectable del service GenericTable
   * @param {PanelService} panelService per la gestione della modale
   */
  constructor(
    private genericTableService: GenericTableService,
    private panelService: PanelService
  ) {}

  /**
   * Lifecycle Hook dell'OnInit.
   * Si effettua la sottoscrizione all'observable dell'evento di update dello stato del filtraggio/ricerca.
   * Nella callback si assegna alla variabile isFiltering il valore aggiornato dello stato del filtraggio/ricerca.
   * Si effettua la sottoscrizione all'observable dell'evento di distruzione tabella.
   * Nella callback si aggiorna il numero della tabella
   */
  ngOnInit() {
    this.numeroTabella = ++this.genericTableService.numeroTabelle;
    this.updateFilteringStatusSubscription = this.genericTableService
      .filteringStatusEventListener()
      .subscribe((status) => {
        this.isFiltering = status;
      });

    this.tableDestroySubscription = this.genericTableService
      .tableDestroyListener()
      .subscribe(() => {
        --this.genericTableService.numeroTabelle;
        if (this.numeroTabella > this.genericTableService.numeroTabelle) {
          --this.numeroTabella;
        }
      });
    if (this.dataSource?.data?.length) {
      this.dataSource.connect().value?.forEach((row: any) => {
        if (row.select) {
          this.selection.select(row);
        }
      });
    }
    this.setColumnDimension();
  }

  /**
   * Lifecycle Hook dell'OnChanges. In cui al cambio del dataSource si effettua il clear della selezione
   * @param {SimpleChanges} changes I cambi in corso
   */
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['dataSource']?.previousValue !==
      changes['dataSource']?.currentValue
    ) {
      this.selection.clear();
    }
    if (changes['displayedColumns']) {
      this.setColumnDimension();
    }
  }

  /**
   * Lifecycle hook per l'onDestroy
   * Si annullano le iscrizione effettuate agli observable
   */
  ngOnDestroy() {
    if (this.updateFilteringStatusSubscription) {
      this.updateFilteringStatusSubscription.unsubscribe();
    }
    if (this.tableDestroySubscription) {
      this.tableDestroySubscription.unsubscribe();
    }
    this.genericTableService.emitTableDestroy();
  }

  /**
   * Emette l'evento di cambio pagina o di ricerca
   * @param {any} event l'oggetto che ha il numero della pagina (o null nel caso sia una ricerca da zero)
   */
  changePage(event: any) {
    this.isFiltering = true;
    this.emitChangePage.emit({
      number: event?.pageIndex ?? 0,
      searchString: this.searchValue ?? null,
    });
  }

  /**
   * Emette l'opzione selezionata nella select dell'header
   * @param {string} selectedOption
   */
  selectOption(selectedOption: string) {
    this.emitSelectedOption.emit({ selectValue: selectedOption });
  }

  /**
   * Aggiorna il termine di ricerca e chiama la funzione per il cambio pagina
   * @param {string} searchValue la string su cui fare la ricerca
   */
  search(searchValue: string) {
    this.searchValue = searchValue;
    this.changePage(null);
  }

  /**
   * Effettua il sort della singola colonna della tabella
   * @param {any} event La colonna e il value sulla quale effettuare il sort
   */
  sortEvent(event: any) {
    this.emitSearchEvent.emit(event);
  }

  /**
   * Emette l'evento di applicazione di azione di gruppo con l'azione da effettuare e la selezione degli elementi su cui effettuare l'azione
   * @param {string} azione l'azione da effettuare
   */
  applicaAzioniDiGruppo(azione: string) {
    this.emitApplicaAzioniDiGruppo.emit({
      azione: azione,
      selected: this.selection.selected,
    });
  }

  /**
   * Alterna lo stato di un elemento nella lista degli elementi selezionati
   * @param {any} element l'elemento di cui alternare lo stato della selezione
   */
  checkElement(element: any) {
    this.selection.toggle(element);
    this.emitSelectedElements.emit(this.selection.selected);
  }

  /** Se il numero di elementi selezionti è uguale al numero totale di righe */
  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.connect().value?.length;
      return numSelected === numRows;
    } else {
      return false;
    }
  }

  /**
   * Seleziona tutte le righe se non sono tutte selezionate, altrimenti le deseleziona tutte
   * Esegue l'emit degli elementi selezionati
   */
  checkAll() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.connect().value?.forEach((row: any) => {
          this.selection.select(row);
        });
    this.emitSelectedElements.emit(this.selection.selected);
  }
  /**Setta il numero di colonne della tabella */
  setColumnDimension() {
    this.gridTemplate = this.displayedColumns
      .map((c) => {
        return this.cellHeadTypes[c] === 'checkbox'
          ? '40px'
          : c === 'action'
          ? this.dataSource?.data?.some((d: any) => d.action?.length > 3)
            ? '240px'
            : '150px'
          : this.small
          ? '1fr'
          : '2fr';
      })
      .join(' ');
  }
}
