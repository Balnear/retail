import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../../material-module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LABEL_CONSTANT,
  ICON_CONSTANT,
  BUTTON_CONSTANT,
  ERROR_CONSTANT,
} from '../../../../constants';
import { LoginService } from '../../../../services';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';

@Component({
  selector: 'app-reimposta-password',
  standalone: true,
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reimposta-password.component.html',
  styleUrl: './reimposta-password.component.scss',
})
export default class ReimpostaPasswordComponent implements OnInit {
  /** FormGroup per il login */
  form!: FormGroup;
  /** Indica se la password deve essere mostrata in chiaro */
  passwordHide = true;
  /** Indica se il repeatPassword deve essere mostrato in chiaro */
  repeatPasswordHide = true;
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
  /** codice fornito per il reset della password */
  oobCode: string = '';

  /**Dati autenticazione */
  private auth = inject(Auth);

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
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
          ],
        ],
        repeatPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
          ],
        ],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    // Ottieni i parametri dell'URL
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode']; // codice fornito per il reset della password
    });
  }

  /**Password validator match */
  passwordMatchValidator(form: FormGroup) {
    const passwordValue = form.get('password')?.value;
    const repeatPasswordValue = form.get('repeatPassword')?.value;

    if (passwordValue !== repeatPasswordValue) {
      form.get('repeatPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  /**
   * Submit del form del reimposta-password.
   */
  submitForm() {
    const newPassword = this.form.value.password;
    confirmPasswordReset(this.auth, this.oobCode, newPassword)
      .then((res) => {
        console.log(res, 'password cambiata');
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        console.log(err, 'fallito');
      });
  }
}
