import { ItensVerificados } from './../models/ItensVerificados';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../models/Response';

@Injectable({
  providedIn: 'root',
})
export class ItensVerificadosService {

  private apiUrl = `${environment.ApiUrl}/Funcionario`

  constructor( private http: HttpClient ) { }

  GetItensVerificados() : Observable<Response<ItensVerificados[]>>{
      return this.http.get<Response<ItensVerificados[]>>(this.apiUrl);
  }
}
