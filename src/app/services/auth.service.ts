import { Injectable } from '@angular/core';
import { UserType } from '../models/types/user';
import { LoginType } from '../models/types/login';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedUser : UserType | null = null;

  constructor() { }

  public isLogged() : boolean {
    let result = window.sessionStorage.getItem('loggedUser');
    if(result)
      this.loggedUser = JSON.parse(result);
    return !!this.loggedUser;
  }

  public login(credentials : LoginType) : boolean{

    if(credentials.codigo != 1234 || credentials.senha != '1234') return false;

    this.loggedUser = {
      codigo : credentials.codigo,
      nome : ''
    }

    window.sessionStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));

    return true;
  }


}
