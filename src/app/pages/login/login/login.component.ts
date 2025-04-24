import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, inject, NgModule, Type } from '@angular/core';
import { LoginType } from '../../../models/types/login';
import notify from 'devextreme/ui/notify';
import { DxButtonModule, DxNumberBoxModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DxNumberBoxModule, FormsModule, DxButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private AuthService = inject(AuthService)
  private router = inject(Router)

  public credentials : LoginType = {
    codigo : null,
    senha : ''
  };

  loginButton(evt : any){
    let result = this.AuthService.login(this.credentials);
    if(!result){
      notify({
        message : 'Usuário e/ou senha incorretos!',
        type : 'warning',
        displayTime : 3000
      }, {direction : 'up-stack', position : 'top center'})
      return;
    }

    this.router.navigate(['']);
  }

}
