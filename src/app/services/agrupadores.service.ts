import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SensoInterface } from '../models/interfaces/senso.interface';
import { json } from 'stream/consumers';
import { StorageService } from './storage.service';

const agrupList: SensoInterface[] = [];

@Injectable({
  providedIn: 'root',
})
export class AgrupadoresService {

  private agrupadoresSubject = new BehaviorSubject<SensoInterface[]>(agrupList);
  private storageKey: string = "AGRUPADORES";

  agrupadores$ = this.agrupadoresSubject.asObservable();

  // agrupadoresList: SensoInterface[] = agrupList;

  constructor(
    private http: HttpClient,
    private storage : StorageService
  ) {}

  getAgrupList(): Observable<SensoInterface[]> {
    let memoryValue = this.agrupadoresSubject.getValue();
    if(memoryValue.length ==0 || memoryValue == null || memoryValue == undefined){
      this.storage.GetItem(this.storageKey).subscribe((rst : any) => {
        if(rst != null) this.agrupadoresSubject.next(rst);
      });
    }
    return this.agrupadores$;
  }

  addAgrupador(agrupador : SensoInterface): void{
    const list = this.agrupadoresSubject.getValue();

    const novoId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;
    const novoAgrupador = {...agrupador, id:novoId};

    this.storage.SetItem(this.storageKey, [...list, novoAgrupador]).subscribe((rst : any) => {
      this.agrupadoresSubject.next(rst)
    });
  }

  updateAgrupador(agrupador : SensoInterface): void{
    const list = this.agrupadoresSubject.getValue();
    const index = list.findIndex(a => a.id === agrupador.id);

    if(index !== -1){
      const novaLista = [...list];
      novaLista[index] = {...agrupador};
      this.storage.SetItem(this.storageKey, novaLista).subscribe((rst : any) => {
        this.agrupadoresSubject.next(rst)
      });
    }
  }

  removerAgrupador(id:number): void{
    const list = this.agrupadoresSubject.getValue();
    const novaLista = list.filter(a => a.id !== id);
    this.storage.SetItem(this.storageKey, novaLista).subscribe((rst : any) => {
      this.agrupadoresSubject.next(rst)
    });
  }

}

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
