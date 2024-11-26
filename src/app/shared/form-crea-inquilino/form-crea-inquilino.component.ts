import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlContainer,
  FormGroupDirective,
  FormGroup,
} from '@angular/forms';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import { AngularMaterialModule } from '../../modules/material-module';
import { InquiliniService } from '../../services';
import {
  HINT_CONSTANT,
  INPUT_CONSTANT,
  LABEL_CONSTANT,
  ERROR_CONSTANT,
  ICON_CONSTANT,
} from '../../constants';

/**Componente per la creazione dell'inquilino */
@Component({
  selector: 'app-form-crea-inquilino',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './form-crea-inquilino.component.html',
  styleUrls: ['./form-crea-inquilino.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormCreaInquilinoComponent {
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
  /**Form creazione inquilino */
  form!: FormGroup;
  /**Tipologia di utente */
  tipologieUser = ['Inquilino'];
  /** Indica se la password deve essere mostrata in chiaro */
  passwordHide = true;
  /** Indica se il repeatPassword deve essere mostrato in chiaro */
  repeatPasswordHide = true;
  /**File immagine selezionato */
  selectedImage: any;
  /** Contiene L'url dell'immagine selezionata */
  imageUrl!: string;
  /**Proprietà per le condizioni della password */
  isMinLengthValid = false;
  hasUppercase = false;
  hasNumber = false;
  hasSpecialChar = false;

  /**
   * Il costruttore della classe ButtonCreaInquilinoComponent
   * @param {InquiliniService} locatoriService  Service locatoriService
   * @param {FormGroupDirecrive} parentF Direttiva di accesso al form contenente nel padre
   * @param {ChangeDetectorRef} cdr -
   */
  constructor(
    private parentF: FormGroupDirective,
    private cdr: ChangeDetectorRef,
    private inquiliniService: InquiliniService
  ) {}

  /**LifeCycle onInit si popola il form */
  ngOnInit() {
    this.form = this.parentF.form;
  }

  /**Metodo per validare i requisiti della password */
  validatePassword() {
    const passwordControl = this.form.get('password');
    const password = passwordControl?.value || '';

    this.isMinLengthValid = passwordControl?.hasError('minlength') === false;
    this.hasUppercase =
      passwordControl?.hasError('pattern') === false || /[A-Z]/.test(password);
    this.hasNumber =
      passwordControl?.hasError('pattern') === false || /[0-9]/.test(password);
    this.hasSpecialChar =
      passwordControl?.hasError('missingSpecialChar') === false;
  }

  /**Metodo per cambiare la classe in base alla validità */
  getValidationClass(isValid: boolean): string {
    return isValid ? 'text-green' : 'text-red';
  }

  /**Aggiornamento immagine profilo */
  changeImage(event: any) {
    const storage = getStorage();
    this.selectedImage = event.target.files[0];
    const filePath = `images/${new Date().getTime()}_${
      this.selectedImage.name
    }`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, this.selectedImage);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Monitora lo stato del caricamento dell'immagine se necessario
      },
      (error) => {
        console.error("Errore durante il caricamento dell'immagine:", error);
      },
      () => {
        // Caricamento completato con successo
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.imageUrl = downloadURL;
          this.inquiliniService.imageUrls = this.imageUrl;
          // Forza Angular a rileggere il valore aggiornato
          this.cdr.detectChanges();
        });
      }
    );
  }
}
