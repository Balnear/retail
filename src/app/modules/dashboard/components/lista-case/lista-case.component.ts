import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import {
  GenericTableService,
  LoaderSpinnerService,
} from '../../../../services';
import { RESULT_CONSTANT, INPUT_CONSTANT, TABLE_COLUMNS } from '../../../../constants';
import { GenericDropDownMenuComponent } from '../../../../shared/generics/generic-drop-down-menu/generic-drop-down-menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CaseService } from '../../../../services/case.service';

/** Componente per la lista delle case */
@Component({
  selector: 'app-lista-case',
  standalone: true,
  templateUrl: './lista-case.component.html',
  styleUrls: ['./lista-case.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    GenericDropDownMenuComponent,
  ],
})
export default class ListaCaseComponent {
  /** Costante per il risultato vuoto della tabella */
  resultConstant = RESULT_CONSTANT;
  /** Constante per l'input della ricera */
  inputConstant = INPUT_CONSTANT;
  /** Contiene la lista delle zone */
  listaZone: any[] = [];
  /** Stringa contenente il volore della ricerca generica */
  searchValue: string | null = null;
  /** Booleana per lo stato del filtraggio */
  filtering: boolean = false;
  /** Subsciprtion per la lista zone */
  listaZoneSubscription!: Subscription;
  /** Le actions della dropdown */
  actions: any[] = [
    {
      label: 'Modifica',
      icon: 'edit', // Usa l'icona di Material Icons (opzionale)
      actionFunction: (r: any) => this.modificaCasa(r.id) // Funzione da richiamare
    },
    {
      label: 'Elimina',
      icon: 'delete', // Icona Material Icons
      actionFunction: (r: any) => this.eliminaCasa(r.id) // Funzione da richiamare
    }
  ];

  displayedColumns = TABLE_COLUMNS.case;
  dataSource = new MatTableDataSource<any>(); // DataSource per MatTable
  errore: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Il costruttore della classe, si popola la variabile listaCase con la lista delle case instanziata nel resolver
   * @param {CaseService} caseService L'injectable del service CaseService
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinnerService
   * @param {ActivatedRoute} activatedRoute Fornisce accesso alle informazioni sulla rotta associata a questa componente
   */
  constructor(
    private caseService: CaseService,
    private loaderSpinnerService: LoaderSpinnerService,
  ) {
    
  }

  /**Effettuiamo la sottoscrizione alla funzione updateListaZoneListner e rimaniamo in attesa di cambiamenti
   * Una volta notato il cambiamento si effutua la funzione changePage per aggiornare la lista delle zone
   */
  ngOnInit() {
    this.caseService.getAllCase().subscribe({
      next: (caseList) => {
        this.dataSource.data = caseList;  // Assegna i dati alla tabella
      },
      error: (err) => {
        this.errore = 'Errore nel recupero delle case: ' + err.message;
      }
    });
  }

  // Metodo per applicare il filtro alla tabella
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  modificaCasa(id: string){
    console.log('casa modificata', id);
    
  }

  eliminaCasa(id: string){
    console.log('casa eliminata', id);
    
  }
}
