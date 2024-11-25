import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';

import { AngularMaterialModule } from '../../../modules/material-module';
import { CaseService, LocatoriService } from '../../../services';
import {
  ICON_CONSTANT,
  INPUT_CONSTANT,
  LABEL_CONSTANT,
} from '../../../constants';
import { GenericStepperModal } from '../../generics';
import L from 'leaflet';

/** Componente per lo step di riepilogo */
@Component({
  selector: 'app-step-riepilogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './step-riepilogo.component.html',
  styleUrls: ['./step-riepilogo.component.scss'],
  providers: [
    KeyValuePipe,
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class StepRiepilogoComponent {
  /** Constante per le label degli input */
  inputConstant = INPUT_CONSTANT;
  /** Costante per le label generiche */
  labelConstant = LABEL_CONSTANT;
  /** Costante per le label delle icone */
  iconConstant = ICON_CONSTANT;
  /** Riferimento al valore del form */
  formValue!: any;
  /** Indirizzo iniziale */
  primoIndirizzo!: string;
  /** Citta iniziale */
  primaCitta!: string;
  /** Mappa */
  private map!: L.Map;

  /**
   * Il costruttore della classe
   * @param {CaseService} caseService L'injectable del service caseService
   * @param {GenericStepperModal} genericStepperModal Accesso alla componente dello stepper
   * @param {FormGroupDirecrive} parentF Direttiva di accesso al form contenente nel padre
   */
  constructor(
    public caseService: CaseService,
    private locatoriService: LocatoriService,
    private genericStepperModal: GenericStepperModal,
    private parentF: FormGroupDirective
  ) {
    this.formValue = parentF.form.value;
  }

  /** Lifecyclehook dell'onInit */
  ngOnInit() {
    this.initMap();
    this.primoIndirizzo = this.formValue.indirizzo;
    this.primaCitta = this.formValue.citta;
    this.ricercaIndirizzo(this.formValue.indirizzo, this.formValue.citta);
    this.locatoriService.getLocatore(this.formValue.locatore.id).subscribe({
      next: (user) => {
        this.formValue.locatore.displayName = user?.displayName;
        this.formValue.locatore.phoneNumber = user?.phoneNumber;
      },
      error: (err) => {
        console.error("Errore nel recupero dell'utente:", err);
      },
    });
  }

  /**
   * Cambio di step per la modifica delle informazioni
   * @param {number} step lo step a cui rimandare
   */
  changeStep(step: number) {
    this.genericStepperModal.changeStep(step);
  }

  // Definisci la mappa con il layer satellitare
  private initMap(): void {
    this.map = L.map('map', {
      center: [41.9028, 12.4964], // Default: Roma
      zoom: 13,
    });

    const satelliteLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }
    );

    satelliteLayer.addTo(this.map);
  }

  /**ngOnChanges rileva e gestisce i cambiamenti delle proprietà */
  ngOnChanges() {
    if (
      this.primoIndirizzo !== this.formValue.indirizzo ||
      (this.primoIndirizzo === this.formValue.indirizzo &&
        this.primaCitta !== this.formValue.citta) ||
      this.primaCitta === this.formValue.citta
    ) {
      this.ricercaIndirizzo(this.formValue.indirizzo, this.formValue.citta);
    }
  }

  /**Funzione per cercare e centrare la mappa su un indirizzo */
  ricercaIndirizzo(indirizzo: string, citta: string): void {
    const query = `${indirizzo}, ${citta}`; // Combina indirizzo e città
    const geocodingURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    fetch(geocodingURL)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          this.map.setView([lat, lon], 15); // Centra la mappa sull'indirizzo
          L.marker([lat, lon]).addTo(this.map).bindPopup(query).openPopup();
        } else {
          console.error('Indirizzo non trovato');
        }
      })
      .catch((error) => {
        console.error("Errore nella ricerca dell'indirizzo:", error);
      });
  }

  /** Funzione che restituisce la classe CSS in base allo stato */
  getStatusClass(statoAffitto: string) {
    switch (statoAffitto) {
      case 'LIBERO':
        return 'chip-green';
      case 'IN SCADENZA':
        return 'chip-orange';
      case 'OCCUPATO':
        return 'chip-red';
      default:
        return '';
    }
  }

  /**Funzione che restituisce l'icona in base allo stato */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'LIBERO':
        return this.iconConstant.done;
      case 'IN SCADENZA':
        return this.iconConstant.warning;
      case 'OCCUPATO':
        return this.iconConstant.block;
      default:
        return '';
    }
  }

  /** Funzione che restituisce la classe CSS in base allo stato */
  getStatusClassManutenzione(statoManutenzione: string) {
    switch (statoManutenzione) {
      case 'BUONO':
        return 'chip-orange';
      case 'DA RISTRUTTURARE':
        return 'chip-red';
      case 'NUOVO':
        return 'chip-green';
      default:
        return '';
    }
  }

  /**Funzione che restituisce l'icona in base allo stato */
  getStatusIconManutenzione(status: string): string {
    switch (status) {
      case 'BUONO':
        return this.iconConstant.emergency_home;
      case 'DA RISTRUTTURARE':
        return this.iconConstant.construction;
      case 'NUOVO':
        return this.iconConstant.energy_savings_leaf;
      default:
        return '';
    }
  }
}
