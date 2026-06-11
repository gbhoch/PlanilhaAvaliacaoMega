import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SensoInterface } from '../models/interfaces/senso.interface';
// import { StorageService } from './storage.service';
import { ApiService } from './api.service';

// const agrupList: SensoInterface[] = [];

@Injectable({
  providedIn: 'root',
})
export class AgrupadoresService {

  private url: string;
  private agrupadoresSubject = new BehaviorSubject<SensoInterface[]>([]);
  agrupadores$ = this.agrupadoresSubject.asObservable();

  // agrupadoresList: SensoInterface[] = agrupList;

  constructor(
    private http: HttpClient,
    private api : ApiService
  ) {
    this.url = `${this.api.baseUrl}/agrupadores`;
  }

  getAgrupList(): Observable<SensoInterface[]> {
    return this.http.get<SensoInterface[]>(this.url).pipe(
      tap(agrupadores => this.agrupadoresSubject.next(agrupadores))
    );
  }

  addAgrupador(agrupador : SensoInterface): Observable<SensoInterface>{
    return this.http.post<SensoInterface>(this.url, agrupador).pipe(
      tap(() => this.getAgrupList().subscribe())
    );
  }

  updateAgrupador(agrupador : SensoInterface): Observable<SensoInterface>{
    return this.http.put<SensoInterface>(`${this.url}/${agrupador.id}`, agrupador).pipe(
      tap(() => this.getAgrupList().subscribe())
    );
  }

  removerAgrupador(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => this.getAgrupList().subscribe())
    );
  }
}
