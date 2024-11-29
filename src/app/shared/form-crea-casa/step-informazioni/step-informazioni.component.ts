import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlContainer,
  FormGroupDirective,
  FormGroup,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Auth } from '@angular/fire/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { AngularMaterialModule } from '../../../modules/material-module';
import { CaseService, LocatoriService, LoginService } from '../../../services';
import {
  ERROR_CONSTANT,
  HINT_CONSTANT,
  ICON_CONSTANT,
  INPUT_CONSTANT,
  LABEL_CONSTANT,
} from '../../../constants';
import { NoEmojiDirective, TrimDirective } from '../../../directives';

/** Componente per lo step delle informazioni */
@Component({
  selector: 'app-step-informazioni',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './step-informazioni.component.html',
  styleUrls: ['./step-informazioni.component.scss'],
  providers: [
    NoEmojiDirective,
    TrimDirective,
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class StepInformazioniComponent {
  /** Riferimento al form */
  form!: FormGroup;
  /** Costante per i messaggi di suggerimento */
  hintConstant = HINT_CONSTANT;
  /** Constante per le label degli input */
  inputConstant = INPUT_CONSTANT;
  /** Constante per le label */
  labelConstant = LABEL_CONSTANT;
  /** Constante per gli errori */
  errorConstant = ERROR_CONSTANT;
  /** Constante per le icone */
  iconConstant = ICON_CONSTANT;
  /**Nome della casa */
  nomi = ['Monolocale', 'Bilocale', 'Trilocale'];
  /**Tipologia della casa */
  tipologieCase!: string[];
  /**Stato di affitto */
  affitto = ['Libero', 'Occupato', 'In scadenza'];
  /**Stato di manutenzione */
  manutenzione = ['Buono', 'Da ristrutturare', 'Nuovo'];
  /** Le option della select locatori */
  locatoriOption: any;
  /**Variabile per la checkbox */
  isChecked: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  /**Variabile per memorizzare il file caricato */
  file: File | null = null;

  /**
   * linkFile è una variabile di tipo SafeResourceUrl che memorizza un URL sicuro
   * utilizzato per incorporare o visualizzare risorse esterne (ad es. PDF, video, ecc.).
   * L'URL è sanitizzato per prevenire vulnerabilità di sicurezza come attacchi XSS.
   * Inizialmente è impostato a null e viene assegnato solo quando viene fornito un link valido.
   */
  linkFile: SafeResourceUrl | null = null;

  /**
   * Il costruttore della classe
   * @param {LocatoriService} locatoriService L'injectable del service locatoriService
   * @param {CaseService} caseService L'injectable del service caseService
   * @param {FormGroupDirecrive} parentF Direttiva di accesso al form contenente nel padre
   * @param {DomSanitizer} sanitizer DomSanitizer viene utilizzato per sanitizzare i contenuti dinamici come URL, HTML,
   * stili o script, al fine di prevenire vulnerabilità di sicurezza come attacchi XSS.
   * Sanitizza le risorse non sicure e rende gli URL sicuri per l'uso in componenti
   * Angular, come in attributi src, href o nelle risorse esterne visualizzate.
   */
  constructor(
    private auth: Auth,
    private locatoriService: LocatoriService,
    private loginService: LoginService,
    private caseService: CaseService,
    private parentF: FormGroupDirective,
    private sanitizer: DomSanitizer
  ) {}
  /** Lifecycle hook dell'onInit, */
  ngOnInit() {
    this.form = this.parentF.form;
    if (this.loginService.locatore === true) {
      const user = this.auth.currentUser;
      if (user) {
        this.locatoriService.getLocatore(user.uid).subscribe({
          next: (res) => (this.locatoriOption = [res]),
        });
      }
    } else {
      this.locatoriService.getAllLocatori().subscribe({
        next: (users: any) => (this.locatoriOption = users),
        error: (err) =>
          console.error('Errore nel recupero degli utenti Locatore:', err),
      });
    }
    this.tipologieCase = this.caseService.tipologie;
    console.log(this.form, 'form informazioni');
    this.linkFile = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.form.get('documentoArredamento')?.value
    );
  }

  /** Lifecycle hook dell'onDestroy, */
  ngOnDestroy() {
    this.locatoriOption = {};
  }

  /**Metodo per disabilitare i giorni precedenti alla data corrente */
  filtroDateFuture = (d: Date | null): boolean => {
    const oggi = new Date(); // Data corrente
    return d ? d >= oggi : false; // Confronta la data corrente con la data selezionata
  };

  /**Metodo chiamato quando cambia lo stato del checkbox*/
  onArredamentoChange(): void {
    const arredamentoControl = this.form.get('arredamento');
    if (arredamentoControl?.value === true) {
      this.isChecked = true;
      this.form.get('documentoArredamento');
      // Se il checkbox è selezionato, possiamo mostrare l'input del file
    } else {
      // Se non è selezionato, puoi rimuovere il documento selezionato
      this.file = null;
    }
  }

  /**Metodo per attivare il file input */
  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  /**Metodo per gestire il drop del file */
  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  /** Metodo per evitare comportamento default del dragover */
  preventDefault(event: DragEvent): void {
    event.preventDefault();
  }

  /**Metodo chiamato quando la checkbox viene selezionata */
  onCheckboxChange() {
    if ((this.isChecked = true)) {
      this.uploadFile(); // Chiama uploadFile quando la checkbox è selezionata
    }
  }

  /**Metodo per selezionare il file dal file input */
  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.file = input.files[0]; // Salva il file selezionato
      this.onCheckboxChange();
    }
  }

  /** Metodo per caricare il file*/
  async uploadFile() {
    if (this.file) {
      this.isChecked = false;
      const storage = getStorage();
      const filePath = `documenti/${this.file.name}`;
      const fileRef = ref(storage, filePath);
      try {
        // Carica il file
        await uploadBytes(fileRef, this.file);

        // Ottieni l'URL di download
        const downloadURL = await getDownloadURL(fileRef);
        this.form.get('documentoArredamento')?.setValue(downloadURL);
      } catch (error) {}
    } else {
    }
  }

  /**Metodo per gestire il file caricato */
  handleFile(file: File): void {
    this.file = file;
    this.form.get('documentoArredamento')?.setValue(this.file);
  }

  /**Metodo per rimuovere il file */
  removeFile(): void {
    this.file = null; // Rimuove il file selezionato
  }
}
