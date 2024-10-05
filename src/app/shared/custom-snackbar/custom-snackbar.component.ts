import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AngularMaterialModule } from '../../modules/material-module';

/** La componente della snackBar custom */
@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss'],
})
export class CustomSnackbarComponent {
  /**
   * Il costruttore della classe
   * @param {any} data configurazione snackBar
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  /** Chiude la snackBar */
  closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}
