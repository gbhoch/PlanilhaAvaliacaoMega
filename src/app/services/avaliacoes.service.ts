import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

export interface ItemAvaliado {
  agrupador: string;
  item: string;
  nota: number;
  anotacao: string;
}

export interface AvaliacaoPayload {
  setor_id: number;
  nome_avaliador: string;
  data_avaliacao: string;
  media_geral: number;
  itens: ItemAvaliado[];
}

export interface AvaliacaoSalva {
  id: number;
  setor_id: number;
  nome_avaliador: string;
  data_avaliacao: string;
  media_geral: number;
  criado_em: string;
  itens?: ItemAvaliado[];
}

@Injectable({
  providedIn: 'root'
})
export class AvaliacoesService {

  private url: string;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    this.url = `${this.api.baseUrl}/avaliacoes`;
  }

  getAvaliacoes() : Observable<AvaliacaoSalva[]> {
    return this.http.get<AvaliacaoSalva[]>(this.url);
  }

  getAvaliacaoById(id : number) : Observable<AvaliacaoSalva> {
    return this.http.get<AvaliacaoSalva>(`${this.url}/${id}`);
  }

  salvarAvaliacao(avaliacao : AvaliacaoPayload) : Observable<AvaliacaoSalva> {
    return this.http.post<AvaliacaoSalva>(this.url, avaliacao);
  }

  deletarAvaliacao(id : number) : Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
