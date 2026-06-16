import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, inject } from '@angular/core';
import { LoginType } from '../../../models/types/login';
import { NotificationService } from '../../../shared/services/notification.service';
import { DxButtonModule, DxNumberBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DxNumberBoxModule, FormsModule, DxButtonModule, DxTextBoxModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private AuthService = inject(AuthService)
  private router = inject(Router)
  private notification = inject(NotificationService)

  public credentials : LoginType = {
    codigo : null,
    senha : ''
  };

  loginButton(){
    let result = this.AuthService.login(this.credentials);
    if(!result){
      this.notification.warning('Usuário e/ou senha incorretos!', { width: 300 });
      return;
    }

    this.router.navigate(['/agrupadores']);
  }

}
