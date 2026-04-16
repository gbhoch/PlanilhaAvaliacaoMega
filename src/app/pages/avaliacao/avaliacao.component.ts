import { SensoInterface } from './../../models/interfaces/senso.interface';
import { AgrupadoresService } from './../../services/agrupadores.service';
import { ItensVerificadosService } from './../../services/itens-verificados.service';
import { SetoresService } from './../../services/setores.service';
import { Component } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDrawerModule,
  DxTemplateModule,
  DxDropDownBoxModule,
  DxListModule,
  DxPopupModule,
} from 'devextreme-angular';
import { SetorInterface } from '../../models/interfaces/setores.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuToolbarService } from '../../services';
import { ItensVerificados } from '../../models/ItensVerificados';
import { ItemAvaliacaoInterface } from '../../models/interfaces/item-avaliacao.interface';

type ReorderCtx =
  | { layer: 'agrupadores' }
  | { layer: 'itens'; agrupadorNome: string };

@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [
    DxDrawerModule,
    DxButtonModule,
    DxTemplateModule,
    FormsModule,
    CommonModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    DxListModule,
    DxPopupModule,
  ],
  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.css',
})
export class AvaliacaoComponent {
  private generateUniqueId(): number {
    return Date.now() + Math.floor(Math.random() * 100000);
  }

  [x: string]: any;
  setoresList: SetorInterface[] = [];
  agrupadoresList: SensoInterface[] = [];
  itensList: ItensVerificados[] = []; // Interafce de Itens Verificados

  agrupadoresMap = new Map<string, SensoInterface>();

  isNovaPlanilha = false;
  setorEditando?: SetorInterface;
  modoEdicao = false;

  drawerAberto = false;
  popupVisivel = false;
  popUpExcluirItem = false;
  indexParaExcluir: number | null = null;
  agrupadorAtual = '';
  itensSelecionaveis: ItemAvaliacaoInterface[] = [];
  itensSelecionadosTemp: ItemAvaliacaoInterface[] = [];
  itemSelecionadoExcluir: any = null;
  itensDoAgrupadorMap: Record<string, ItemAvaliacaoInterface[]> = {};

  constructor(
    public menuService: MenuToolbarService,
    private agrupadoresService: AgrupadoresService,
    private setoresService: SetoresService,
    public itensVerifService: ItensVerificadosService,
  ) {
    this.setoresService.getSetores().subscribe((setores) => {
      console.log('Setores carregador:', setores);
      this.setoresList = setores;
    });

    this.agrupadoresService.getAgrupList().subscribe((data) => {
      this.agrupadoresList = data;
      console.log('AvaliacaoComponent', data);
    });

    this.itensVerifService.getItensVerificados().subscribe((itens) => {
      this.itensList = itens;
      console.log('ItensVerif', itens);
    });
  }

  private atualizarMapaAgrupadores() {
    this.agrupadoresMap.clear();
    this.itensDoAgrupadorMap = {};

    this.agrupadoresSelecionados.forEach((agrupador) => {
      this.agrupadoresMap.set(agrupador.nome, agrupador);
      this.itensDoAgrupadorMap[agrupador.nome] = agrupador.itens ?? [];
    })
  }

  agrupadoresSelecionados: SensoInterface[] = []; // nome do agrupador → itens selecionados

  agrupadoresExpandidos: Record<string, boolean> = {};

  abrirDrawerSetor(setor: SetorInterface) {
    this.setorEditando = { ...setor }; // Faz cópia para edição
    this.drawerAberto = true;

    const planoProcessado: SensoInterface[] = setor.planoDeAvaliacao.map(
      (agrupador) => ({
        ...agrupador,
        itens: (agrupador.itens || []).map((item) => ({
          descricao: item.descricao,
          id: item.id || this.generateUniqueId(),
          ativo: item.ativo ?? false
        }))
      })
    )

    this.agrupadoresSelecionados = planoProcessado;
    this.atualizarMapaAgrupadores();
  }

  onCellDblClick(evt: any) {
    const setor = evt.data;
    if (!setor) return;

    this.setorEditando = structuredClone(setor);
    this.modoEdicao = true;
    this.drawerAberto = true;
  }

  openPlanilhas() {
    this.drawerAberto = true;
    this.setorEditando = {
      id: Date.now(),
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
      planoDeAvaliacao: []
    };

    this.agrupadoresSelecionados = []; /* ******************* */

    // Carrega agrupadores cadastrados dinamicamente
    this.agrupadoresService.getAgrupList().subscribe((data) => {
      this.agrupadoresList = data;
      console.log(
        'Agrupadores carregados na tela de avaliação:',
        this.agrupadoresList,
      );
    });

    console.log('Botão clicado, abrindo novo drawer.');
  }

  onItemDeleting(e: { cancel: boolean }) {
    if (this.agrupadoresList.length === 1) {
      e.cancel = true;
    }
  }

  onItemSelectionChanged(e: any) {
    this.itensSelecionadosTemp = e.selectedRowsData;
  }

  abrirSelecaoItens(agrupadorNome: string) {
    this.agrupadorAtual = agrupadorNome;

    // 1. Encontra o agrupador completo
    const agrupador = this.agrupadoresList.find(
      (a) => a.nome === agrupadorNome,
    );

    this.itensSelecionaveis = (agrupador?.itens ?? []).map(item => ({
      ...item,
      id: item.id || this.generateUniqueId()
    }));

    const agrupadoresSelecionados = this.agrupadoresMap.get(agrupadorNome);

    this.itensSelecionadosTemp = agrupadoresSelecionados?.itens ?? [];
    this.popupVisivel = true;
  }

  confirmarSelecaoItens() {
    const agrupador = this.agrupadoresMap.get(this.agrupadorAtual);

    if (agrupador) {
      agrupador.itens = this.itensSelecionadosTemp.map(item => ({
        ...item,
        id: item.id || this.generateUniqueId(),
        ativo: true
      }));
    }

    console.log("item");

    this.popupVisivel = false;
    this.itensSelecionadosTemp = []; /* Limpa a lista temporária */

    this.agrupadoresSelecionados = [...this.agrupadoresSelecionados];
    // this.atualizarMapaAgrupadores();
  }

  getAgrupadorIndex(data: any): string {
    const index = this.agrupadoresList.findIndex((a) => a.nome === data.nome);
    return index !== -1 ? `${index + 1}.` : '';
  }

  getItemIndex(
    agrupadorNome: string,
    itemData: any
  ): string {

    const agrupadorIndex = this.agrupadoresList.findIndex(
      a => a.nome === agrupadorNome,
    );

    if (agrupadorIndex === -1) return '';

    const listaItens = this.agrupadoresMap.get(agrupadorNome)?.itens || [];

    const itemIndex = listaItens.findIndex(
      i => i.id === itemData.id
    );

    return itemIndex !== -1 ? `${agrupadorIndex + 1}.${itemIndex + 1}` : '';
  }

  getItensDoAgrupador(agrupadorNome : string): ItemAvaliacaoInterface[]{
    return this.agrupadoresMap.get(agrupadorNome)?.itens ?? [];
  }

  getBotaoAdicionar() {
    return [
      {
        hint: 'Selecionar Itens',
        icon: 'plus',
        onClick: (e: any) => {
          this.abrirSelecaoItens(e.row.data.nome);
        },
      },
    ];
  }

  get botaoRemover(): any {
    return [
      {
        hint: 'Remover',
        icon: 'trash',
        onClick: (e: any) => {
          this.itemSelecionadoExcluir = e.row.data;
          console.error('Não é possível determinar o agrupadorName');
        },
      },
    ];
  }

  agrupadoresReorderHandler = (e: any) => {
    const lista = [...this.agrupadoresSelecionados];

    const movido = lista.splice(e.toIndex, 1)[0];
    lista.splice(e.toIndex, 0, movido);

    this.agrupadoresSelecionados = lista;
    this.atualizarMapaAgrupadores();
  }

  onReorderItens(e: any, agrupador: SensoInterface){
    if (!agrupador.itens) return;

    const lista = [...agrupador.itens];

    const movido = lista.splice(e.fromIndex, 1)[0];
    lista.splice(e.toIndex, 0, movido);

    agrupador.itens = lista;
  }

  removerItemSelecionado(
    agrupadorNome: string,
    item: { id: number; descricao: string },
  ) {

    const agrupador = this.agrupadoresMap.get(agrupadorNome);

    if(!agrupador?.itens) return;

    agrupador.itens = agrupador.itens.filter(
      (i) => i.id !== item.id
    );

    // Força a detecção de mudança para atualizar a grade detalhe
    this.agrupadoresSelecionados = [...this.agrupadoresSelecionados];
    this.atualizarMapaAgrupadores();
  }

  confirmarExclusao() {
    if (this.agrupadorAtual && this.itemSelecionadoExcluir) {
      this.removerItemSelecionado(
        this.agrupadorAtual,
        this.itemSelecionadoExcluir,
      );

      this.agrupadorAtual = '';
      this.itemSelecionadoExcluir = null;
    }
    this.popUpExcluirItem = false;
  }

  fecharPopup() {
    this.popUpExcluirItem = false;
    this.indexParaExcluir = null;
  }

  salvarAlteracoes() {
    if (!this.setorEditando) {
      console.error('Nenhum setor sendo editado.');
      return;
    }

    // ANEXAR o plano de avaliação (com os itens agrupados) ao setor
    this.setorEditando.planoDeAvaliacao = this.agrupadoresSelecionados;

    // Encontra o setor original na lista principal para atualizá-lo.
    const index = this.setoresList.findIndex(
      (s) => s.id === this.setorEditando!.id,
    );

    if (index !== -1) {
      this.setoresList[index] = { ...this.setorEditando! };
      this.setoresList = [...this.setoresList];

      console.log('Setor atualizado e salvo:', this.setoresList[index]);
    } else {
      // Se for um novo setor, adicionaria ele à lista aqui.
      console.warn(
        'Setor não encontrado para atualização. Isso deveria ser um novo setor?',
      );
    }

    this.drawerAberto = false;

    // Limpar o estado de edição
    this.agrupadoresSelecionados = [];
    this.atualizarMapaAgrupadores();
    this.setorEditando = undefined;
  }

  cancelarAlteracoes(): void {
    this.drawerAberto = false;
  }

  cancelarAlteracoesItens(): void {
    this.popupVisivel = false;
  }
}
