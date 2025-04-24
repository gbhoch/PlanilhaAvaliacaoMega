import { ItensVerificados } from './../models/ItensVerificados';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Response } from '../models/Response';

const itensVerifList: ItensVerificados[] = [{
  "itemID": 6284,
  "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
  "ativo": true,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 32543,
  "descricaoItem": "Colaboradores com as mãos limpas?",
  "ativo": true,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 654,
  "descricaoItem": "x",
  "ativo": false,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 87945,
  "descricaoItem": "Os frascos de produtos químicos que possuem rótulo próprio, estão dentro da validade?",
  "ativo": true,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 6734,
  "descricaoItem": "kljhdaskjsa",
  "ativo": true,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 5875,
  "descricaoItem": "x",
  "ativo": true,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 1658,
  "descricaoItem": "di gue?",
  "ativo": false,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 75615,
  "descricaoItem": "x",
  "ativo": false,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}, {
  "itemID": 4564,
  "descricaoItem": "x",
  "ativo": true,
  "dataDeCriacao": "03/04/2025",
  "dataDeModificacao": "--"
}];

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
