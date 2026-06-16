// TODO(review): STUB — getItensVerificados() returns mock/empty data. Injected by the live
// AvaliacaoComponent (where its result is currently unused) and by HomeComponent (no route).
// Kept pending confirmation. See REFATORACAO.md > "Arquivos marcados para revisão".
import { ItensVerificados } from './../models/ItensVerificados';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Response } from '../models/Response';

const itensVerifList: ItensVerificados[] = [

];

@Injectable({
  providedIn: 'root',
})

export class ItensVerificadosService {

  itensverificad : ItensVerificados [] = itensVerifList;

  private apiUrl = `${environment.ApiUrl}/Funcionarios`

  constructor( private http: HttpClient ) { }

  getItensVerificados() {
    return of(this.itensverificad);
  }
}
