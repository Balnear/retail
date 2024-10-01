import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../../material-module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LABEL_CONSTANT, ICON_CONSTANT, BUTTON_CONSTANT, ERROR_CONSTANT } from '../../../../constants/index';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule, ReactiveFormsModule],
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
  /** messaggio errore email o password */
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
    // private loaderSpinnerService: LoaderSpinnerService,
    // private loginService: LoginService,
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
   * Nella callback salva il nominativo dell'utente nel localStorage e il token nel localStorage o sessionStorage (in base alla selezione remember me).
   */
  submitForm() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    // this.loginService.login(email, password);
  }
  /**
  Funzione per il ritorno alla pagina di login
   */
  // recuperaPassword() {
  //   this.loginService.tempPasswordStatus = 'default';
  //   this.router.navigate(['login/recupera-password']);
  // }
}
