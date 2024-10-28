import { AbstractControl, ValidatorFn } from '@angular/forms';

/**  Controlli per gli erorri su login*/
export class CustomValidator {
  /**Custom validator per controllare se il valore contiene una virgola seguita da un numero */
  static commaNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      // Verifica se la stringa contiene una virgola seguita da un numero
      const valid = /,\d+/.test(value);

      // Se non è valido, restituisce l'errore, altrimenti null
      return valid ? null : { commaNumberError: true };
    };
  }

  // Validator personalizzato che verifica se l'input contiene esattamente 5 numeri
  static fiveDigitsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      // Verifica se il valore contiene esattamente 5 numeri
      const valid = /^\d{5}$/.test(value);

      // Se non è valido, restituisce un oggetto con un errore, altrimenti null
      return valid ? null : { fiveDigitsError: true };
    };
  }
}
