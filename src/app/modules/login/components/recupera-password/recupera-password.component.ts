import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../material-module';
import {
  LABEL_CONSTANT,
  ICON_CONSTANT,
  BUTTON_CONSTANT,
  ERROR_CONSTANT,
} from '../../../../constants';
import { LoaderSpinnerService, LoginService, NotificationService } from '../../../../services';

/** classe per il componente di recupero della password */
@Component({
  selector: 'app-recupera-password',
  standalone: true,
  imports: [
    RouterModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recupera-password.component.html',
  styleUrl: './recupera-password.component.scss',
})
export default class RecuperaPasswordComponent {
  /** FormGroup per il login */
  form!: FormGroup;
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
    private loaderSpinnerService: LoaderSpinnerService,
    private loginService: LoginService,
    private notifica: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    /** Inizializzazione del form */
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
    });
  }

  /**
   * Submit del form di recupera-password.
   */
  submitForm() {
    this.loaderSpinnerService.show();
    const email = this.form.value.email;
    this.loginService.recuperaPassword(email).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
        this.loaderSpinnerService.hide();
        this.notifica.show('Email per il reset della password inviata', 5000, 'success');
      },
      error: (err) => {
        this.loaderSpinnerService.hide();
      },
    });
  }
}
