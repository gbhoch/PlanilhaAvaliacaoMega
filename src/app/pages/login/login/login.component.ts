import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, inject, NgModule, Type } from '@angular/core';
import { LoginType } from '../../../models/types/login';
import notify from 'devextreme/ui/notify';
import { DxButtonModule, DxNumberBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DxNumberBoxModule, FormsModule, DxButtonModule, DxTextBoxModule, ReactiveFormsModule],
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

  loginButton(){
    let result = this.AuthService.login(this.credentials);
    if(!result){
      notify({
        message : 'Usuário e/ou senha incorretos!',
        type : 'error',
        displayTime : 3000,
        width : 300
      }, {direction : 'up-stack', position : 'top center'})
      return;
    }

    this.router.navigate(['/menu']);
  }

}
