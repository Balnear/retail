import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AngularMaterialModule } from '../../modules/material-module';
import { CaseService } from '../../services';
import { ICON_CONSTANT, LABEL_CONSTANT } from '../../constants';
import L from 'leaflet';

/**Componente per il dettaglio della casa */
@Component({
  selector: 'app-dettaglio-casa',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './dettaglio-casa.component.html',
  styleUrl: './dettaglio-casa.component.scss',
})
export class DettaglioCasaComponent {
  /** Richiamo le costanti da labelCostant */
  labelConstant = LABEL_CONSTANT;
  /** Richiamo la ICON_CONSTANT */
  iconConstant = ICON_CONSTANT;
  /** I dati della casa */
  data!: any;
  /** Le informazioni generali */
  informazioni!: any;
  /** I dati del locatore */
  locatore!: any;
  /** I dati delle caratteristiche */
  caratteristiche!: any;
  /** I dati dei costi */
  costi!: any;
  /** Mappa */
  private map!: L.Map;

  /**
   * Il costruttore della classe.
   * @param {CaseService} caseService - Injectable del service CaseService per gestire le operazioni sulle case.
   */
  constructor(private caseService: CaseService) {
    this.data = this.caseService.dettaglioCasa;
    this.informazioni = this.data._document.data.value.mapValue.fields;
    this.locatore =
      this.data._document.data.value.mapValue.fields.locatore.mapValue.fields;
    this.caratteristiche =
      this.data._document.data.value.mapValue.fields.caratteristiche.mapValue.fields;
    this.costi =
      this.data._document.data.value.mapValue.fields.costi.mapValue.fields;
  }

  /** Lifecyclehook dell'onInit */
  ngOnInit() {
    this.initMap();
    this.ricercaIndirizzo(
      this.informazioni.indirizzo.stringValue,
      this.informazioni.citta.stringValue
    );
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
  getStatusIcon(statoAffitto: string): string {
    switch (statoAffitto) {
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
