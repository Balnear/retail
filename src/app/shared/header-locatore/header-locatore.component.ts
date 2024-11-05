import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../modules/material-module';
import { MatDialog } from '@angular/material/dialog';
import { LocatoriService, LoaderSpinnerService } from '../../services';
import { CustomDialogService } from '../../services/dialog.service';
import { GenericDetailModalComponent } from '../generics';
import { LABEL_CONSTANT, ICON_CONSTANT } from '../../constants';

/**Componente header del dettaglio del locatore */
@Component({
  selector: 'app-header-locatore',
  standalone: true,
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header-locatore.component.html',
  styleUrls: ['./header-locatore.component.scss'],
})
export class HeaderLocatoreComponent {
  /**costanti per la visualizzazione */
  labelCostant = LABEL_CONSTANT;
  /**costanti per le icone */
  iconCostant = ICON_CONSTANT;
  /** I dati del locatore */
  locatore: any;
  /** Riferimento al matDialog */
  dialogRef: any;
  /**modifica dello stato */
  editStatus: boolean = false;

  /**
   * Il construttore della classe
   * @param {LocatoriService} locatoriService - Injectable del service LocatoriService per gestire le operazioni sui locatori.
   * @param {CustomDialogService} customDialogService Service customDialogService
   * @param {LoaderSpinnerService } loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {GenericDetailModalComponent} genericDetailModalComponent La chiamata alla componente modale dettaglio
   * @param {MatDialog} dialog Injectable del service MatDialog
   * @param {FormBuilder} fb - Injectable del service FormBuilder per creare form group e form control
   */
  constructor(
    private locatoriService: LocatoriService,
    private customDialogService: CustomDialogService,
    private loaderSpinnerService: LoaderSpinnerService,
    private genericDetailModalComponent: GenericDetailModalComponent,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.locatore = this.locatoriService.dettaglioLocatore;
  }

  /**Funzione per la chiusura della dialog */
  closeDialog() {
    this.genericDetailModalComponent.closeDialog();
  }

  /** */
  modificaLocatore(id: string) {}

  /** */
  eliminaLocatore(id: string) {}
}
