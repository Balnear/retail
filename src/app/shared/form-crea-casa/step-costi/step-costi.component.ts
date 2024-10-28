import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-step-costi',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './step-costi.component.html',
  styleUrls: ['./step-costi.component.scss'],
  providers: [
    NoEmojiDirective,
    TrimDirective,
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class StepCostiComponent {
  /** Riferimento al form */
  form!: FormGroup;
  /** Constante per le label degli input */
  inputConstant = INPUT_CONSTANT;
  /** Constante per le label */
  labelConstant = LABEL_CONSTANT;
  /** Constante per gli errori */
  errorConstant = ERROR_CONSTANT;
  /**Tipo di pagamento */
  tipoPagamento = ['Online', 'Contanti'];
  /**Definisci un EventEmitter che emetterà un valore alla madre */
  // @Output() durataContrattoChanged = new EventEmitter<string>();

  /**
   * Il costruttore della classe
   * @param {FormGroupDirecrive} parentF Direttiva di accesso al form contenente nel padre
   */
  constructor(private parentF: FormGroupDirective) {
    this.form = parentF.form;
  }
  ngOnInit() {
    this.form = this.parentF.form;
    console.log(this.form, 'form costi');
    // // Sottoscrizione ai cambiamenti dei valori dei campi
    // this.form
    //   .get('costi.dataInizioContratto')
    //   ?.valueChanges.subscribe((value) => {
    //     this.controllaERicalcolaDurataContratto();
    //   });

    // this.form
    //   .get('costi.dataFineContratto')
    //   ?.valueChanges.subscribe((value) => {
    //     this.controllaERicalcolaDurataContratto();
    //   });
  }
  /**Metodo per disabilitare i giorni precedenti alla data corrente */
  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    // Imposta l'ora, i minuti e i secondi a zero per confrontare solo la data
    today.setHours(0, 0, 0, 0);
    return date !== null && date >= today; // Ritorna true se la data è oggi o successiva
  };

  /**Metodo che controlla se entrambi i valori sono presenti e chiama il calcolo */
  // controllaERicalcolaDurataContratto() {
  //   const dataInizio = this.form.get('costi.dataInizioContratto')?.value;
  //   const dataFine = this.form.get('costi.dataFineContratto')?.value;

  //   if (dataInizio && dataFine) {
  //     this.aggiornaDurataContratto();
  //     console.log('Calcolo effettuato.');
  //   }
  // }

  // /**Calcola la durata in giorni, settimane e mesi */
  // calculateDuration(): string {
  //   const start = new Date(this.form.get('costi.dataInizioContratto')?.value);
  //   const end = new Date(this.form.get('costi.dataFineContratto')?.value);
  //   let risultato = '';

  //   // Durata in giorni
  //   const timeDifference = end.getTime() - start.getTime();
  //   const totalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  //   // Durata in settimane e giorni rimanenti
  //   const fullWeeks = Math.floor(totalDays / 7); // Numero di settimane complete
  //   const remainingDays = totalDays % 7; // Giorni rimanenti dopo le settimane

  //   // Durata in mesi
  //   const startYear = start.getFullYear();
  //   const endYear = end.getFullYear();
  //   const startMonth = start.getMonth();
  //   const endMonth = end.getMonth();
  //   const fullMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

  //   // Calcola le settimane rimanenti in caso di mesi incompleti
  //   const startDatePlusMonths = new Date(start);
  //   startDatePlusMonths.setMonth(startDatePlusMonths.getMonth() + fullMonths);
  //   const remainingTimeAfterMonths =
  //     end.getTime() - startDatePlusMonths.getTime();
  //   const remainingDaysAfterMonths = Math.ceil(
  //     remainingTimeAfterMonths / (1000 * 60 * 60 * 24)
  //   );

  //   // Se la differenza di giorni è minore di 7, restituisce solo giorni
  //   if (totalDays < 7) {
  //     if (totalDays === 1) {
  //       risultato = '1 giorno';
  //     } else {
  //       risultato = `${totalDays} giorni`;
  //     }
  //   }
  //   // Se ci sono settimane, calcoliamo settimane e giorni rimanenti
  //   else if (fullWeeks >= 1 && totalDays < 30) {
  //     risultato = `${fullWeeks} ${fullWeeks === 1 ? 'settimana' : 'settimane'}`;
  //     if (remainingDays > 0) {
  //       risultato += ` e ${remainingDays} ${
  //         remainingDays === 1 ? 'giorno' : 'giorni'
  //       }`;
  //     }
  //   }
  //   // Se ci sono mesi, calcoliamo i mesi, le settimane e i giorni rimanenti
  //   else if (fullMonths >= 1) {
  //     risultato = `${fullMonths} ${fullMonths === 1 ? 'mese' : 'mesi'}`;
  //     if (remainingDaysAfterMonths >= 7) {
  //       const remainingWeeks = Math.floor(remainingDaysAfterMonths / 7);
  //       risultato += ` e ${remainingWeeks} ${
  //         remainingWeeks === 1 ? 'settimana' : 'settimane'
  //       }`;
  //     }
  //     const leftoverDays = remainingDaysAfterMonths % 7;
  //     if (leftoverDays > 0) {
  //       risultato += ` e ${leftoverDays} ${
  //         leftoverDays === 1 ? 'giorno' : 'giorni'
  //       }`;
  //     }
  //   }
  //   return risultato;
  // }

  // /**Metodo per aggiornare l'input con il risultato di calculation() */
  // aggiornaDurataContratto() {
  //   const calcolato = this.calculateDuration(); // Ottieni il valore calcolato
  //   console.log(this.form.get('costi.durataContratto')?.value, 'aggiorno');
  //   console.log(calcolato, 'calcolato');
  //   console.log(
  //     this.form.get('costi.dataInizioContratto')?.value,
  //     'dataInizio'
  //   );
  //   this.form.get('costi.durataContratto')?.setValue(calcolato); // Aggiorna il FormControl
  //   this.durataContrattoChanged.emit(calcolato); // Emetti l'evento con il valore calcolato
  // }
}
