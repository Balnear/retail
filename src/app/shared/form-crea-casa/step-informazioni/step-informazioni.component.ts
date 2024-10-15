import { Component, ViewChild } from '@angular/core';
import { LocatoriService } from '../../../services';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlContainer,
  FormGroupDirective,
  FormGroup,
} from '@angular/forms';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { AngularMaterialModule } from '../../../modules/material-module';
import {
  ERROR_CONSTANT,
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
  /** Constante per le label degli input */
  inputConstant = INPUT_CONSTANT;
  /** Constante per le label */
  labelConstant = LABEL_CONSTANT;
  /** Constante per gli errori */
  errorConstant = ERROR_CONSTANT;
  /** Constante per le icone */
  iconConstant = ICON_CONSTANT;
  /**Tipologia casa */
  tipologie = ['Casa al mare', 'Casa in citta'];
  /**Stato di affitto */
  affitto = ['Libero', 'Occupato', 'In scadenza'];
  /**Stato di manutenzione */
  manutenzione = ['Buono', 'Da ristrutturare', 'Nuovo'];
  /** Le option della select locatori */
  locatoriOption: any;
  /**Variabile per la checkbox */
  isChecked: boolean = false;
  @ViewChild('fileInput') fileInput: any;
  /**Variabile per memorizzare il file caricato */
  file: File | null = null;

  /**
   * Il costruttore della classe
   * @param {FormGroupDirecrive} parentF Direttiva di accesso al form contenente nel padre
   */
  constructor(
    private locatoriService: LocatoriService,
    private parentF: FormGroupDirective,
    private firestore: Firestore
  ) {}
  ngOnInit() {
    this.form = this.parentF.form;
    console.log(this.form, 'form informazioni');

    // this.form.value.arredamento = false;
    // this.locatoriService.getAllLocatori().subscribe((res: any) => {
    // this.locatoriOption = res;
    // });
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
      // Se il checkbox è selezionato, possiamo mostrare l'input del file
    } else {
      // Se non è selezionato, puoi rimuovere il documento selezionato
      this.file = null;
    }
  }

  /**Metodo per attivare il file input */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
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

        // Memorizza l'URL in Firestore
        await addDoc(collection(this.firestore, 'case'), {
          documentoArredamento: downloadURL,
        });
      } catch (error) {}
    } else {
    }
  }

  /**Metodo per gestire il file caricato */
  handleFile(file: File): void {
    this.file = file;
    this.form.get('documentoArredamento')?.setValue(this.file);
    console.log(this.form.get('documentoArredamento'), 'documento');
  }

  /**Metodo per rimuovere il file */
  removeFile(): void {
    this.file = null; // Rimuove il file selezionato
  }
}
