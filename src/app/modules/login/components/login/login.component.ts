import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../../material-module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AngularMaterialModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

}
