import { of } from 'rxjs';
import { AddItens } from './../models/AddItens';
import { Injectable } from '@angular/core';

const addItensList : AddItens[] = [
//   {
//   "itemID": 6284,
//   "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
//   "ativo": false,
//   "dataDeCriacao": "03/04/2025",
//   "dataDeModificacao": "--"
// },{
//   "itemID": 16843,
//   "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
//   "ativo": false,
//   "dataDeCriacao": "03/04/2025",
//   "dataDeModificacao": "--"
// },{
//   "itemID": 475,
//   "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
//   "ativo": false,
//   "dataDeCriacao": "03/04/2025",
//   "dataDeModificacao": "--"
// },{
//   "itemID": 6785,
//   "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
//   "ativo": false,
//   "dataDeCriacao": "03/04/2025",
//   "dataDeModificacao": "--"
// },{
//   "itemID": 472,
//   "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
//   "ativo": false,
//   "dataDeCriacao": "03/04/2025",
//   "dataDeModificacao": "--"
// },{
//   "itemID": 319,
//   "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
//   "ativo": false,
//   "dataDeCriacao": "03/04/2025",
//   "dataDeModificacao": "--"
// },{
//   "itemID": 7842,
//   "descricaoItem": "Há material ou objetos em desuso ou fora de local definido?",
//   "ativo": false,
//   "dataDeCriacao": "03/04/2025",
//   "dataDeModificacao": "--"
// }
]

@Injectable({
  providedIn: 'root'
})
export class AddItensService {

  add : AddItens [] = addItensList;

  constructor() { }

  getAddItens(){
    return of(this.add);
  }
}
