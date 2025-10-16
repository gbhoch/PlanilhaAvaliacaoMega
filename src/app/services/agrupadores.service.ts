import { Injectable } from '@angular/core';
import { Agrupadores } from '../models/Agrupadores';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { SensoInterface } from '../models/interfaces/senso.interface';

const agrupList: SensoInterface[] = [
  // {
  //   nome: 'Senso de Utilização',
  //   ativo: true,
  //   dataDeCriacao: '20/05/2025',
  //   itens: [],
  // } as SensoInterface,
  // {
  //   nome: 'Senso de Organização',
  //   ativo: true,
  //   dataDeCriacao: '20/05/2025',
  //   itens: [],
  // } as SensoInterface,
  // {
  //   nome: 'Senso de Limpeza',
  //   ativo: false,
  //   dataDeCriacao: '20/05/2025',
  //   itens: [],
  // } as SensoInterface,
  // {
  //   nome: 'Senso de Asseio',
  //   ativo: true,
  //   dataDeCriacao: '20/05/2025',
  //   itens: [],
  // } as SensoInterface,
  // {
  //   nome: 'Senso de Autodisciplina',
  //   ativo: true,
  //   dataDeCriacao: '20/05/2025',
  //   itens: [],
  // } as SensoInterface,
  // {
  //   nome: 'Senso de Segurança',
  //   ativo: false,
  //   dataDeCriacao: '20/05/2025',
  //   itens: [],
  // } as SensoInterface,
];

@Injectable({
  providedIn: 'root',
})
export class AgrupadoresService {
  agrupadoresList: SensoInterface[] = agrupList;

  constructor(private http: HttpClient) {}

  getAgrupList() {
    return of(this.agrupadoresList);
  }
}
