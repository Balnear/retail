import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BUTTON_CONSTANT } from '../../../../../constants';
import { AngularMaterialModule } from '../../../../../modules/material-module';



/** Componente per il footer della generic modal form con stepper */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  /** Esegue l'emit dell'evento per il cambio di step */
  @Output() changeStepEmitter: EventEmitter<any> = new EventEmitter<any>();
  /** Esegue l'emit dell'evento di submit */
  @Output() confirmSubmit: EventEmitter<any> = new EventEmitter<any>();
  /** Lo step attualmente in visualizzazione */
  @Input() currentStep: number = 0;
  /** Lo state del bottone di cambia step */
  @Input() disabled: boolean = true;
  /** Il numero totale degli step */
  @Input() stepsNumber!: number;
  /** Il testo del button di submit */
  @Input() submitFormText!: string;

  /** Costante per la label dei bottoni */
  buttonConstant: any = BUTTON_CONSTANT;

  /** Naviga allo step successivo */
  goToNextStep() {
    ++this.currentStep;
    this.changeStepEmitter.emit(this.currentStep);
  }

  /** Naviga allo step precedente */
  goToPreviousStep() {
    --this.currentStep;
    this.changeStepEmitter.emit(this.currentStep);
  }

  /** Effettua il cambio dello step */
  changeStep() {
    if (this.currentStep === this.stepsNumber - 1) {
      this.confirmSubmit.emit();
    } else {
      this.goToNextStep();
    }
  }
}
