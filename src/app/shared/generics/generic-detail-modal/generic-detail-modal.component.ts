import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { INJECT_DATA_COMPONENT } from '../../../constants';
import { HostDirective, StepDirective } from '../../../directives';
import { PanelService } from '../../../services/panel.service';



@Component({
  selector: 'app-generic-detail-modal',
  standalone: true,
  imports: [CommonModule, HostDirective, StepDirective],
  templateUrl: './generic-detail-modal.component.html',
  styleUrls: ['./generic-detail-modal.component.scss'],
  animations: [
    trigger('dialog', [
      state('close', style({ transform: 'translateX(50%)' })),
      state('open', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300)),
    ]),
  ],
})
export class GenericDetailModalComponent {
  /** Emette l'evento di chiusura del dialog */
  @Output() closeDialogEmit = new EventEmitter<void>();
  /** Decoratore ViewChild per l'elemento con la direttiva dello stepper */
  @ViewChild(StepDirective, { static: true }) stepHost!: StepDirective;
  /** Decoratore ViewChild per l'elemento con la direttiva del'host */
  @ViewChild(HostDirective, { static: true }) hostDir!: HostDirective;
  /** Lo state della component */
  state: 'open' | 'close' = 'close';
  /** Subscription all'observable dell'evento di mostra/nascondi Loader Spinner */
  showGenericDetailListenerSubject!: Subscription;
  /** Indica se deve essere mostrato */
  show: boolean = false;

  /**
   * Il costruttore della classe
   * @param {any} data L'esercizio da visualizzare
   * @param {PanelService} panelService L'injectable del service PanelService
   */
  constructor(
    private panelService: PanelService,
    @Inject(INJECT_DATA_COMPONENT) public data?: any
  ) {
    this.state = 'open';
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  /**
   * Lifecycle Hook dell'AfterViewInit
   * Si effettua il focus del div principale
   */
  ngAfterViewInit() {
    const el = document.getElementById('dialog');
    el?.focus();
  }

  /**
   * HostListener dell'evento di pressione esc sulla tastiera per la chiusura del dialog
   */
  @HostListener('window:keyup.esc') onKeyUp() {
    if (this.panelService.isDetailOpen) {
      this.panelService.close();
    } else {
      this.closeDialog();
    }
  }

  /**
   * Carica il componente
   */
  loadComponent() {
    if (this.data.headComponent) {
      const viewContainerHeadRef = this.hostDir.viewContainerRef;
      viewContainerHeadRef.clear();
      const componentRef = viewContainerHeadRef.createComponent<any>(
        this.data.headComponent
      );
      componentRef.location.nativeElement.className =
        componentRef.instance.componentDimension;
    }
    if (this.data.components?.length) {
      const viewContainerRef = this.stepHost.viewContainerRef;
      viewContainerRef.clear();
      this.data.components.map((component: any) => {
        const componentRef = viewContainerRef.createComponent<any>(component);
        componentRef.location.nativeElement.className =
          componentRef.instance.componentDimension;
      });
    }
  }

  /**
   * Funzione di chiusura del dialog, si aggiorna lo state del dialog a close e si effettua un timeout di 300ms
   * Al termine del timeout si effettua l'emit dell'output di chiusura del dialog
   */
  closeDialog() {
    let callback = () => {
      this.state = 'close';
      setTimeout(() => {
        this.closeDialogEmit.emit();
      }, 300);
    };
    if (this.panelService.isDetailOpen) {
      this.panelService.close();
      setTimeout(() => {
        callback();
      }, 300);
    } else {
      callback();
    }
  }
}
