import { Injectable } from '@angular/core';
import { Agrupadores } from '../models/Agrupadores';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';


const agrupList: Agrupadores [] = [
  {
  "nomeAgrup": "Senso de Utilização",
  "ativo": true,
  "dataDeCriacao": "20/05/2025",
  "dataDeModificacao": "--",
  "itens" : []
  },
  {
    "nomeAgrup": "Senso de Organização",
    "ativo": true,
    "dataDeCriacao": "20/05/2025",
    "dataDeModificacao": "--",
    "itens": []
  },
  {
    "nomeAgrup": "Senso de Limpeza",
    "ativo": true,
    "dataDeCriacao": "20/05/2025",
    "dataDeModificacao": "--",
    "itens" : []
  },
  {
    "nomeAgrup": "Senso de Asseio",
    "ativo": true,
    "dataDeCriacao": "20/05/2025",
    "dataDeModificacao": "--",
    "itens" : []
  },{
    "nomeAgrup": "Senso de Autodisciplina",
    "ativo": true,
    "dataDeCriacao": "20/05/2025",
    "dataDeModificacao": "--",
    "itens" : []
  }
  ,{
    "nomeAgrup": "Senso de Segurança",
    "ativo": true,
    "dataDeCriacao": "20/05/2025",
    "dataDeModificacao": "--",
    "itens" : []
  }
]

@Injectable({
  providedIn: 'root'
})
export class AgrupadoresService {

  agrupadoresList : Agrupadores [] = agrupList;

  constructor(private http : HttpClient) { }

  getAgrupList(){
    return of(this.agrupadoresList);
  }

}
