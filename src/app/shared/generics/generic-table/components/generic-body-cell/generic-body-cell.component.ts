import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ACCESSIBILITY_CONSTANT, BUTTON_CONSTANT } from '../../../../../constants';
import { AngularMaterialModule } from '../../../../../modules/material-module';
import { SafePipe } from '../../../../../pipes';
import { GenericTableService } from '../../../../../services/generic-table.service';



/** Componente per la singola cella del body della tabella */
@Component({
  selector: 'app-generic-body-cell',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, SafePipe],
  templateUrl: './generic-body-cell.component.html',
  styleUrls: ['./generic-body-cell.component.scss'],
  providers: [SafePipe],
})
export class GenericBodyCellComponent {
  /** Decorator Viewchild dell'elemento della lista delle chip */
  @ViewChild('chipsContainer') chipsContainer!: ElementRef;
  /** La colonna del head */
  @Input() col!: string;
  /** L'elemento della riga */
  @Input() element: any;
  /** Il tipo di cella del body */
  @Input() bodyType!: any;
  /** Numero tabella */
  @Input() numeroTabella!: number;
  /** Aria Label per la chip list */
  @Input() chipListAriaLabel: string =
    ACCESSIBILITY_CONSTANT.chip_list_aria_label;
  /** Emitter dell'evento di check/uncheck della checkbox */
  @Output() emitCheckElement: EventEmitter<any> = new EventEmitter<any>();
  /** Subscription all'observable dell'evento di check/uncheck dell'check della cella del head */
  checkAllSubscription!: Subscription;
  /** Costante per la label del button */
  buttonConstant: any = BUTTON_CONSTANT;
  /** Costante delle label dell'accessibilità*/
  accessibilityConstant = ACCESSIBILITY_CONSTANT;
  /** Indica il numero nascosto di elementi della chiplist */
  chipListHiddenNumber: number = 0;
  /** Lista dei primi tre element della chiplist */
  chipListWithOnlyFirstThreeElement: any[] = [];
  /** La classe da assegna alla chip */
  chipClass: string = '';
  /** Booleana per il controllo della scadenza */
  scaduto!: boolean;

  constructor(
    private genericTableService: GenericTableService,
  ) {}

  /**
   * Lifecycle Hook dell'OnInit.
   * Se la colonna è uguale a 'select' si effettua la sottoscrizione all'observable dell'evento di checkAll
   */
  ngOnInit() {
    if (this.col === 'select') {
      this.checkAllSubscription = this.genericTableService
        .checkAllListener()
        .subscribe({
          next: (value: any) => {
            if (value.numeroTabella == this.numeroTabella) {
              this.element[this.col] = value.isAllSelected;
            }
          },
        });
    }
    if (this.col === 'scadenza_abbonamento') {
      this.scadenzaAbbonamento();
    }
  }

  /** Lifecycle Hook dell'AfterViewInit per impostare quante chip mostrare per intero */
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.element[this.col] == true) {
        this.selected(this.element);
      }
      if (this.bodyType?.type === 'chip') {
        this.setChipListElements();
      }
    }, 100);
  }

  /**
   * Lifecycle hook dell'OnDestroy.
   * Si annullano le iscrizione effettuate agli observable.
   * Si effettua il complete del Subject ngUnsubscribe in modo che le chiamate alle API ancora in corso vengono cancellate per via del takeUntil con questo subject.
   */
  ngOnDestroy(): void {
    if (this.checkAllSubscription) {
      this.checkAllSubscription.unsubscribe();
    }
  }

  /**
   * Listener dell'evento di resize della finestra in cui si reimposta la lista dei chip
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.bodyType?.type === 'chip') {
      this.setChipListElements();
    }
  }

  /**
   * Check/unCheck dell'elemento
   * @param {any} element L'elemento selezionato
   */
  selected(element: any) {
    /**this.element[this.col] = !this.element[this.col]; */
    if (!this.element.selected && this.element.inputTextValue) {
      this.element.inputTextValue = null;
    }
    this.emitCheckElement.emit(element);
  }

  /**
   * Imposta la lista di chip visibiile
   */
  private setChipListElements() {
    const qSelector: any = document.querySelectorAll('th.tag');
    const width = qSelector?.length ? qSelector[0].offsetWidth : 0;
    let elementToShow = 0;
    let totalLength = 0;

    if (
      Array.isArray(this.element[this.col]) &&
      this.element[this.col].length > 0
    ) {
      this.element[this.col].map((el: any, index: number) => {
        totalLength += 8 * el.length + 24;
        if (index > 0 && totalLength < width - 50) {
          elementToShow++;
        }
        this.chipClass = this.setChipClass(el);
      });

      this.chipListWithOnlyFirstThreeElement = this.element[this.col].slice(
        0,
        ++elementToShow
      );
      this.chipListHiddenNumber = this.element[this.col].length - elementToShow;
    }
  }

  /**
   * Imposta la classe da assegnare alla chip
   * @param {string} val Il tipo di classe da assegnare
   * @returns {string} La classe da assegnare
   */
  private setChipClass(val: string): string {
    switch (val) {
      case 'IN CORSO':
        return 'chip-in-corso';
      case 'DISABILITATO':
        return 'chip-disabilitato';
      case 'STAGIONALE':
        return 'tipologia-stagionale';
      case 'PERENNE':
        return 'tipologia-perenne';
      case 'ATTIVO':
        return 'stato-attivo';
      case 'INATTIVO':
        return 'stato-inattivo';
      default:
        return 'chip-disabilitato';
    }
  }

  scadenzaAbbonamento() {
    // Otteniamo la data odierna.
    const today = new Date();

    // Convertiamo la data di scadenza dell'abbonamento in un oggetto Date.
    const expirationDate = new Date(this.element[this.col]);

    // Confrontiamo la data di scadenza con la data odierna.
    if (expirationDate.getTime() < today.getTime()) {
      this.scaduto;
    } else {
      !this.scaduto;
    }
  }
}
