import { SetorInterface } from './../models/interfaces/setores.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SetoresService {

  private url: string;
  private setoresSubject = new BehaviorSubject<SetorInterface[]>([]);
  setores$ = this.setoresSubject.asObservable();

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    this.url = `${this.api.baseUrl}/setores`;
  }

  // Carrega todos os setores da API e atualiza o BehaviorSubject
  getSetores(): Observable<SetorInterface[]> {
    return this.http.get<SetorInterface[]>(this.url).pipe(
      tap(setores => this.setoresSubject.next(setores))
    );
  }

  addSetor(setor: SetorInterface): Observable<SetorInterface> {
    return this.http.post<SetorInterface>(this.url, setor).pipe(
      tap(() => this.getSetores().subscribe()) // atualiza a lista
    );
  }

  updateSetor(setor: SetorInterface): Observable<SetorInterface> {
    return this.http.put<SetorInterface>(`${this.url}/${setor.id}`, setor).pipe(
      tap(() => this.getSetores().subscribe())
    );
  }

  removerSetor(setor: SetorInterface): Observable<any> {
    return this.http.delete(`${this.url}/${setor.id}`).pipe(
      tap(() => this.getSetores().subscribe())
    );
  }

  getSetorComPlano(id : number) : Observable<SetorInterface> {
    return this.http.get<SetorInterface>(`${this.url}/${id}/plano`);
  }

  salvarPlano(setorId: number, planoDeAvaliacao: any[]): Observable<SetorInterface> {
    return this.http.put<SetorInterface>(
      `${this.url}/${setorId}/plano`,
      { planoDeAvaliacao }
    );
  }
}
