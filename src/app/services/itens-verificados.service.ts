// TODO(review): SUSPECTED UNUSED — getItensVerificados() returns mock/empty data and is now only
// referenced by HomeComponent (no route). Candidate for removal together with the Home cluster.
// See REFATORACAO.md > "Arquivos marcados para revisão".
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
