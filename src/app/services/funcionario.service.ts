// TODO(review): SUSPECTED UNUSED — not injected by any active component. Kept pending confirmation.
// See REFATORACAO.md > "Arquivos marcados para revisão".
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/Funcionario';
import { Response } from '../models/Response';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private apiUrl = `${environment.ApiUrl}/Funcionarios`

  constructor( private http: HttpClient ) { }

  GetFuncionario() : Observable<Response<Funcionario[]>>{
    return this.http.get<Response<Funcionario[]>>(this.apiUrl);
  }
}
