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
// import { StorageService } from '../../services/storage.service';
import { AvaliacoesService, AvaliacaoSalva, AvaliacaoPayload } from '../../services/avaliacoes.service';

export interface ItemAvaliado {
  agrupador: string;
  item: string;
  nota: number | null;
  anotacao: string;
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
  agrupadoresDetalheData: {nome: string; media: string; itens: any [] } [] = [];

  // Popup confirmação
  popupConfirmarVisivel = false;

  //Popup Cancelar
  popupCancelarVisivel = false;

  private storageKey = 'AVALIACOES';

  constructor(
    private setoresService: SetoresService,
    private avaliacoesService: AvaliacoesService
  ) {
    this.setoresService.getSetores().subscribe((planilhas) => {
      this.planilhasList = planilhas;
    });
    // this.carregarAvaliacoes();
  }

  onSetorSelecionado(e: any) {
    const setorBasico = this.planilhasList.find(s => s.id === e.value);
    this.setorSelecionado = setorBasico ?? null;
    this.gridData = [];

    if (!setorBasico) return;

    // Busca o setor COM o plano de avaliação da API
    this.setoresService.getSetorComPlano(setorBasico.id).subscribe({
      next: (setor) => {
        console.log('Setor com plano recebido:', setor); // ← log temporário
        this.setorSelecionado = setor;

        if (!setor?.planoDeAvaliacao?.length) {
          console.log('Plano vazio ou inexistente');
          this.gridData = [];
          return;
        }

        const dados = setor.planoDeAvaliacao.flatMap((agrupador: any) =>
          (agrupador.itens ?? []).map((item: any) => ({
            agrupador: agrupador.nome,
            item: item.descricao,
            nota: null,
            anotacao: ''
          }))
        );

        this.gridData = [...dados];

        console.log('gridData montado:', this.gridData); // ← log temporário
      },
      error: (err) => {
        console.error('Erro ao buscar plano do setor:', err);
        this.gridData = [];
      }
    });
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
    if (!this.setorSelecionado) return;

    // Monta o payload no formato que a API espera
    const payload: AvaliacaoPayload = {
      setor_id: this.setorSelecionado.id,
      nome_avaliador: this.nomeAvaliador,
      data_avaliacao: this.dataAvaliacao.toISOString().split('T')[0],
      media_geral: this.calcularMediaGeral(),
      itens: this.gridData.map(i => ({
        agrupador: i.agrupador,
        item: i.item,
        nota: i.nota ?? 0,
        anotacao: i.anotacao
      }))
    };

    this.avaliacoesService.salvarAvaliacao(payload).subscribe({
      next: () => {
        this.popupConfirmarVisivel = false;
        this.resetarFormulario();
        alert('Avaliação salva com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar avaliação:', err);
        alert('Erro ao salvar avaliação. Tente novamente.');
      }
    })
  }

  calcularMediaGeral(): number {
    const itensComNota = this.gridData.filter(i => i.nota !== null);
    if (itensComNota.length === 0) return 0;
    return itensComNota.reduce((acc, i) => acc + (i.nota ?? 0), 0) / itensComNota.length;
  }

  abrirCancelar(){
    this.popupCancelarVisivel = true;
  }

  resetarFormulario() {
    this.nomeAvaliador = '';
    this.dataAvaliacao = new Date();
    this.setorSelecionadoId = null;
    this.setorSelecionado = null;
    this.gridData = [];
    this.popupCancelarVisivel = false;
  }

  // Histórico

  abrirHistorico() {
    this.avaliacoesService.getAvaliacoes().subscribe(avaliacoes => {
      this.avaliacoesSalvas = avaliacoes;
      this.popupHistoricoVisivel = true;
    })
  }

  verDetalhe(avaliacao: any) {
    this.avaliacoesService.getAvaliacaoById(avaliacao.id).subscribe(detalhe => {
      this.avaliacaoDetalhe = detalhe;

      const agrupadores : string[] = [...new Set(
        (detalhe.itens ?? []).map((i: any) => i.agrupador_nome as string)
      )];

      this.agrupadoresDetalheData = agrupadores.map((nome: string) => {
        const itens = (detalhe.itens ?? []).filter((i: any) => i.agrupador_nome === nome);
        const media = itens.reduce((acc: number, i: any) => acc + i.nota, 0) / itens.length;
        return {
          nome,
          media: `Média: ${media.toFixed(1)}`,
          itens
        };
      });

      this.popupDetalheVisivel = true;
    });
  }

  getAgrupadoresDetalhe(): string[] {
    if (!this.avaliacaoDetalhe) return [];
    return [...new Set((this.avaliacaoDetalhe.itens ?? []).map((i : any) => i.agrupador_nome))];
  }

  // getMediaAgrupadorDetalhe(agrupadorNome: string): string {
  //   if (!this.avaliacaoDetalhe) return '';
  //   const itens = this.avaliacaoDetalhe.itens.filter(i => i.agrupador === agrupadorNome && i.nota !== null);
  //   if (itens.length === 0) return 'Sem notas';
  //   const media = itens.reduce((acc, i) => acc + (i.nota ?? 0), 0) / itens.length;
  //   return `Média: ${media.toFixed(1)}`;
  // }

  // getItensPorAgrupador(agrupador: string): ItemAvaliado[] {
  //   return this.avaliacaoDetalhe?.itens.filter(i => i.agrupador === agrupador) ?? [];
  // }
}
