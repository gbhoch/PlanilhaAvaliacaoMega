import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

export interface ItemAvaliado {
  agrupador?: string;
  agrupador_nome: string;
  item?: string;
  item_descricao: string;
  nota: number;
  anotacao: string;
}

// Item enviado ao criar avaliação (POST)
export interface ItemAvaliadoPayload {
  agrupador: string;
  item: string;
  nota: number;
  anotacao: string;
}

// Item recebido da API ao buscar detalhe (GET)
export interface ItemAvaliadoDetalhe {
  id: number;
  avaliacao_id: number;
  agrupador_nome: string;
  item_descricao: string;
  nota: number;
  anotacao: string;
}

export interface AvaliacaoPayload {
  setor_id: number;
  nome_avaliador: string;
  data_avaliacao: string;
  media_geral: number;
  itens: ItemAvaliadoPayload[];  // ← usa o payload
}

export interface AvaliacaoSalva {
  id: number;
  setor_id: number;
  setor_nome?: string;
  nome_avaliador: string;
  data_avaliacao: string;
  media_geral: number;
  criado_em: string;
  itens?: ItemAvaliadoDetalhe[];  // ← usa o detalhe
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
