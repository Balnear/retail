import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AngularMaterialModule } from '../../../material-module';
import {
  LABEL_CONSTANT,
  ICON_CONSTANT,
  BUTTON_CONSTANT,
  ERROR_CONSTANT,
} from '../../../../constants/index';
import {
  InquiliniService,
  LoaderSpinnerService,
  LocatoriService,
  LoginService,
  NotificationService,
} from '../../../../services';
import { take } from 'rxjs';

/** Una classe per il componente del form di login */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  /** FormGroup per il login */
  form!: FormGroup;
  /** Indica se la password deve essere mostrata in chiaro */
  passwordHide = true;
  /** Richiama le costanti da labelCostant */
  labelConstant: any = LABEL_CONSTANT;
  /** Richiama le costanti da iconCostant */
  iconConstant = ICON_CONSTANT;
  /** Label per le CTA */
  buttonConstant = BUTTON_CONSTANT;
  /** Label per gli errori */
  errorConstant = ERROR_CONSTANT;
  /** Messaggio errore email o password */
  errorLogin?: string;

  /**
   * Il costruttore della classes.
   * Si inizializza il FormGroup.
   * @param {LoaderSpinnerService} loaderSpinnerService L'injectable del service LoaderSpinner
   * @param {LoginService} loginService L'injectable del service Login
   * @param {FormBuilder} fb L'injectable del FormBuilder
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private loaderSpinnerService: LoaderSpinnerService,
    private loginService: LoginService,
    private locatoriService: LocatoriService,
    private inquiliniService: InquiliniService,
    private notifica: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
    });
    
  }

  /**
   * Submit del form di login.
   * Nella callback salva il nominativo dell'utente nel localStorage e il token nel localStorage o sessionStorage.
   * Verifica se l'email inserita ha un profilo attivo
   */
  submitForm() {
    this.loaderSpinnerService.show();
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.locatoriService.verificaEmailLocatore(email).pipe(take(1)).subscribe((exists) => {
      if (exists) {
        this.loaderSpinnerService.hide();
        this.loginService.login(email, password).pipe(take(1)).subscribe({
          next: (res) => {
            this.loaderSpinnerService.hide();
            if (res) {
              if (res.userType === 'Locatore') {
                this.loginService.locatore = true;
                console.log(res, 'credenziali');
                this.router.navigate(['/bo/dashboard']);
                this.notifica.show('Accesso eseguito correttamente', -1, 'success');
              } else if (res.userType === 'Inquilino') {
                this.loginService.locatore = false;//TODO: PROVVISORIO IN ATTESA DEL SUPER ADMIN
                console.log(res, 'credenziali');
                this.router.navigate(['/bo/dashboard']);
                this.notifica.show('Accesso eseguito correttamente', -1, 'success');
              }
            }
          },
          error: (error) => {
            this.loaderSpinnerService.hide();
            this.firebaseError(error.code);
          },
        });
      } else if(!exists){
        this.inquiliniService.verificaEmailInquilino(email).pipe(take(1)).subscribe((present) => {
          if (present) {
            this.loaderSpinnerService.hide();
            this.loginService.login(email, password).pipe(take(1)).subscribe({
              next: (res) => {
                this.loaderSpinnerService.hide();
                if (res) {
                  if (res.userType === 'Locatore') {
                    console.log(res, 'credenziali');
                    this.router.navigate(['/bo/dashboard']);
                    this.notifica.show('Accesso eseguito correttamente', -1, 'success');
                  } else if (res.userType === 'Inquilino') {
                    console.log(res, 'credenziali');
                    this.router.navigate(['/bo/dashboard']);
                    this.notifica.show('Accesso eseguito correttamente', -1, 'success');
                  }
                }
              },
              error: (error) => {
                this.loaderSpinnerService.hide();
                this.firebaseError(error.code);
              },
            });
          } else {
            this.loaderSpinnerService.hide();
            this.notifica.show('Le credenziali non sono valide', -1, 'error');
          }
        });

      }else{
        this.loaderSpinnerService.hide();
        this.notifica.show('Le credenziali non sono valide', -1, 'error');
      }
    });  
  }
  /**
  Funzione per il recupero della password
   */
  forgotPassword() {
    this.router.navigate(['login/recupera-password']);
  }

  /**Gestione casi di errore */
  firebaseError(code: string) {
    switch (code) {
      case 'auth/invalid-credential':
        return this.notifica.show('Email o Password errate', 5000, 'error');
      case 'PERMISSION_DENIED':
        return this.notifica.show('Permesso negato', 5000, 'error');
      default:
        return 'Errore sconosciuto';
    }
  }
}
