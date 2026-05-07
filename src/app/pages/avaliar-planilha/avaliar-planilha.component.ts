import { CommonModule } from '@angular/common';
import { SetorInterface } from './../../models/interfaces/setores.interface';
import { Component } from '@angular/core';
import {
  DxButtonModule, DxDataGridModule, DxDateBoxModule,
  DxListModule, DxSelectBoxModule, DxPopupModule,
  DxTextAreaModule, DxNumberBoxModule, DxScrollViewModule
} from 'devextreme-angular';
import { SetoresService } from '../../services/setores.service';
import { SensoInterface } from '../../models/interfaces/senso.interface';
import { ItemAvaliacaoInterface } from '../../models/interfaces/item-avaliacao.interface';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

export interface ItemAvaliado {
  agrupador: string;
  item: string;
  nota: number | null;
  anotacao: string;
}

export interface AvaliacaoSalva {
  id: number;
  nomeAvaliador: string;
  data: Date;
  setor: string;
  itens: ItemAvaliado[];
  mediaGeral: number;
}

@Component({
  selector: 'avaliar-planilha',
  standalone: true,
  imports: [
    FormsModule, CommonModule,
    DxListModule, DxDataGridModule, DxButtonModule,
    DxSelectBoxModule, DxDateBoxModule, DxPopupModule,
    DxTextAreaModule, DxNumberBoxModule, DxScrollViewModule
  ],
  templateUrl: './avaliar-planilha.component.html',
  styleUrl: './avaliar-planilha.component.css'
})
export class AvaliarPlanilhaComponent {

  // Header
  nomeAvaliador: string = '';
  dataAvaliacao: Date = new Date();
  planilhasList: SetorInterface[] = [];
  setorSelecionadoId: number | null = null;
  setorSelecionado: SetorInterface | null = null;

  // Grid
  gridData: ItemAvaliado[] = [];

  // Popup anotação
  popupAnotacaoVisivel = false;
  itemEditando: ItemAvaliado | null = null;
  anotacaoTemp: string = '';

  // Popup histórico
  popupHistoricoVisivel = false;
  avaliacoesSalvas: AvaliacaoSalva[] = [];
  avaliacaoDetalhe: AvaliacaoSalva | null = null;
  popupDetalheVisivel = false;

  // Popup confirmação
  popupConfirmarVisivel = false;

  private storageKey = 'AVALIACOES';

  constructor(
    private setoresService: SetoresService,
    private storageService: StorageService
  ) {
    this.setoresService.getSetores().subscribe((planilhas) => {
      this.planilhasList = planilhas;
    });
    this.carregarAvaliacoes();
  }

  onSetorSelecionado(e: any) {
    const setor = this.planilhasList.find(s => s.id === e.value);
    this.setorSelecionado = setor ?? null;

    if (!setor?.planoDeAvaliacao) {
      this.gridData = [];
      return;
    }

    this.gridData = setor.planoDeAvaliacao.flatMap((agrupador: SensoInterface) =>
      (agrupador.itens ?? []).map((item: ItemAvaliacaoInterface) => ({
        agrupador: agrupador.nome,
        item: item.descricao,
        nota: null,
        anotacao: ''
      }))
    );
  }

  // Calcula média por agrupador para exibir no grouping
  getMediaAgrupador(agrupadorNome: string): string {
    const itens = this.gridData.filter(i => i.agrupador === agrupadorNome && i.nota !== null);
    if (itens.length === 0) return 'Sem notas';
    const media = itens.reduce((acc, i) => acc + (i.nota ?? 0), 0) / itens.length;
    return `Média: ${media.toFixed(1)}`;
  }

  // Anotação
  abrirAnotacao(item: ItemAvaliado) {
    this.itemEditando = item;
    this.anotacaoTemp = item.anotacao;
    this.popupAnotacaoVisivel = true;
  }

  confirmarAnotacao() {
    if (this.itemEditando) {
      this.itemEditando.anotacao = this.anotacaoTemp;
    }
    this.popupAnotacaoVisivel = false;
    this.itemEditando = null;
    this.anotacaoTemp = '';
  }

  // Validação antes de finalizar
  podeFinalizar(): boolean {
    return (
      !!this.nomeAvaliador.trim() &&
      !!this.setorSelecionado &&
      this.gridData.length > 0 &&
      this.gridData.every(i => i.nota !== null)
    );
  }

  abrirConfirmacao() {
    if (!this.podeFinalizar()) return;
    this.popupConfirmarVisivel = true;
  }

  // Salvar avaliação
  confirmarAvaliacao() {
    const novaAvaliacao: AvaliacaoSalva = {
      id: Date.now(),
      nomeAvaliador: this.nomeAvaliador,
      data: this.dataAvaliacao,
      setor: this.setorSelecionado!.nome,
      itens: [...this.gridData],
      mediaGeral: this.calcularMediaGeral()
    };

    this.avaliacoesSalvas = [...this.avaliacoesSalvas, novaAvaliacao];
    this.storageService.SetItem(this.storageKey, this.avaliacoesSalvas).subscribe();

    this.popupConfirmarVisivel = false;
    this.resetarFormulario();
  }

  calcularMediaGeral(): number {
    const itensComNota = this.gridData.filter(i => i.nota !== null);
    if (itensComNota.length === 0) return 0;
    return itensComNota.reduce((acc, i) => acc + (i.nota ?? 0), 0) / itensComNota.length;
  }

  resetarFormulario() {
    this.nomeAvaliador = '';
    this.dataAvaliacao = new Date();
    this.setorSelecionadoId = null;
    this.setorSelecionado = null;
    this.gridData = [];
  }

  // Histórico
  carregarAvaliacoes() {
    this.storageService.GetItem(this.storageKey).subscribe((rst: any) => {
      if (rst) this.avaliacoesSalvas = rst;
    });
  }

  abrirHistorico() {
    this.carregarAvaliacoes();
    this.popupHistoricoVisivel = true;
  }

  verDetalhe(avaliacao: AvaliacaoSalva) {
    this.avaliacaoDetalhe = avaliacao;
    this.popupDetalheVisivel = true;
  }

  getMediaAgrupadorDetalhe(agrupadorNome: string): string {
    if (!this.avaliacaoDetalhe) return '';
    const itens = this.avaliacaoDetalhe.itens.filter(i => i.agrupador === agrupadorNome && i.nota !== null);
    if (itens.length === 0) return 'Sem notas';
    const media = itens.reduce((acc, i) => acc + (i.nota ?? 0), 0) / itens.length;
    return `Média: ${media.toFixed(1)}`;
  }

  getAgrupadoresDetalhe(): string[] {
    if (!this.avaliacaoDetalhe) return [];
    return [...new Set(this.avaliacaoDetalhe.itens.map(i => i.agrupador))];
  }

  getItensPorAgrupador(agrupador: string): ItemAvaliado[] {
    return this.avaliacaoDetalhe?.itens.filter(i => i.agrupador === agrupador) ?? [];
  }
}
