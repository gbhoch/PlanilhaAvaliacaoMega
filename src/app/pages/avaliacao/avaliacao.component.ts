import { ItensVerificadosService } from './../../services/itens-verificados.service';
import { SetoresService } from './../../services/setores.service';
import { planilhaInterface } from '../../models/interfaces/planilha.interface';
import { Component } from '@angular/core';
import {
  DxDataGridModule,
  DxToolbarModule,
  DxButtonModule,
  DxDrawerModule,
  DxTemplateModule,
  DxDropDownBoxModule,
  DxListModule,
  DxPopupModule,
} from 'devextreme-angular';
import { SetorInterface } from '../../models/interfaces/setores.interface';
import { SensoInterface } from '../../models/interfaces/senso.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuToolbarService } from '../../services';
import { AgrupadoresComponent } from '../agrupadores/agrupadores.component';
import { AgrupadoresService } from '../../services/agrupadores.service'; // já deve existir
import { ItemAvaliacaoInterface } from '../../models/interfaces/item-avaliacao.interface';
import { ItensVerificados } from '../../models/ItensVerificados';
import { DxoRowDraggingModule } from 'devextreme-angular/ui/nested';

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
    DxoRowDraggingModule,
  ],
  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.css',
})
export class AvaliacaoComponent {
  [x: string]: any;
  setoresList: SetorInterface[] = [];
  agrupadoresList: SensoInterface[] = [];
  itensList: ItensVerificados[] = []; // Interafce de Itens Verificados
  agrupadoresDataGrid: { agrupador: string; descricao: string }[] = [];

  isNovaPlanilha = false;
  setorEditando?: SetorInterface;
  modoEdicao = false;

  drawerAberto = false;
  popupVisivel = false;
  popUpExcluirItem = false;
  indexParaExcluir: number | null = null;
  agrupadorAtual = '';
  itensSelecionaveis: { descricao: string }[] = [];
  itensSelecionadosTemp: { descricao: string }[] = [];
  itemSelecionadoExcluir: any = null;

  constructor(
    public menuService: MenuToolbarService,
    private agrupadoresService: AgrupadoresService,
    private setoresService: SetoresService,
    public itensVerifService: ItensVerificadosService
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

  agrupadoresSelecionados: {
    [agrupadorNome: string]: { descricao: string }[]; // nome do agrupador → itens selecionados
  } = {};

  agrupadoresExpandidos: {
    [agrupadorNome: string]: boolean;
  } = {};

  abrirDrawerSetor(setor: SetorInterface) {
    this.setorEditando = { ...setor }; // Faz cópia para edição
    this.drawerAberto = true;

    // CARREGA o plano de avaliação salvo para a variável de edição
    this.agrupadoresSelecionados = setor.planoDeAvaliacao
      ? { ...setor.planoDeAvaliacao }
      : {};
  }

  onCellDblClick(evt: any) {
    const setor = evt.data;
    if (!setor) return;

    this.setorEditando = { ...setor };
    this.modoEdicao = true;
    this.drawerAberto = true;

    // CARREGA o plano de avaliação salvo aqui também
    this.agrupadoresSelecionados = setor.planoDeAvaliacao
      ? { ...setor.planoDeAvaliacao }
      : {};
  }

  openPlanilhas() {
    this.drawerAberto = true;
    this.setorEditando = {
      id: Date.now(),
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
    };

    this.agrupadoresSelecionados = {};

    // Carrega agrupadores cadastrados dinamicamente
    this.agrupadoresService.getAgrupList().subscribe((data) => {
      this.agrupadoresList = data;
      console.log(
        'Agrupadores carregados na tela de avaliação:',
        this.agrupadoresList
      );
    });

    console.log('Botão clicado, abrindo novo drawer.');
  }

  onItemDeleting(e: { cancel: boolean }) {
    if (this.agrupadoresList.length === 1) {
      e.cancel = true;
    }
  }

  abrirSelecaoItens(agrupadorNome: string) {
    this.agrupadorAtual = agrupadorNome;

    // 1. Encontra o agrupador completo
    const agrupador = this.agrupadoresList.find(
      (a) => a.nome === agrupadorNome
    );

    // 2. Popula a lista de itens disponíveis para seleção
    // Nota: Dependendo da estrutura de 'itens', pode ser necessário ajustar o map.
    this.itensSelecionaveis =
      agrupador?.itens?.map((i: any) => ({ descricao: i.descricao })) ?? [];

    // 3. Popula a lista temporária com os itens JÁ SELECIONADOS para o checkbox
    // Isso garante que os itens previamente selecionados apareçam marcados no popup
    this.itensSelecionadosTemp =
      this.agrupadoresSelecionados[agrupadorNome] || [];

    this.popupVisivel = true;
    this.agrupadoresExpandidos[agrupadorNome] = true;
  }

  // rowDraggingConfig(agrupadorNome: string) {
  //   return {
  //     allowReordering: true,
  //     onReorder: (e: any) => this.onReorderItem(agrupadorNome, e),
  //   };
  // }

  confirmarSelecaoItens() {
    // Cria um novo array com os itens selecionados
    const novosItensSelecionados = [...this.itensSelecionadosTemp];
    // Substitui o array antigo
    this.agrupadoresSelecionados[this.agrupadorAtual] = novosItensSelecionados;
    // Força a detecção de mudança para atualizar MasterDetail
    this.agrupadoresSelecionados = { ...this.agrupadoresSelecionados };

    this.popupVisivel = false;
  }

  atualizarAgrupadoresDataGrid() {
    this.agrupadoresDataGrid = [];

    for (const agrupador in this.agrupadoresSelecionados) {
      const itens = this.agrupadoresSelecionados[agrupador];
      itens.forEach((item) => {
        this.agrupadoresDataGrid.push({
          agrupador,
          descricao: item.descricao,
        });
      });
    }
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

  getBotaoRemover(agrupadorNome: string) {
    return [
      {
        hint: 'Remover',
        icon: 'trash',
        onClick: (e: any) => {
          this.removerItemSelecionado(agrupadorNome, e.row.data);
        },
      },
    ];
  }

  onReorderItem(agrupadorNome: string, e: any) {
    const lista = this.agrupadoresSelecionados[agrupadorNome];
    if (!lista) return;

    const itemMovido = lista.splice(e.fromIndex, 1)[0];
    lista.splice(e.toIndex, 0, itemMovido);

    this.agrupadoresSelecionados[agrupadorNome] = [...lista];
    this.agrupadoresSelecionados = { ...this.agrupadoresSelecionados };
  }

  botaoRemoverItem = [
    {
      hint: 'Remover',
      icon: 'trash',
      onClick: (e: any) => {
        this.removerItemSelecionado(this.itemSelecionadoExcluir, e.row.data);
        this.popUpExcluirItem = true;
      },
    },
  ];

  removerItemSelecionado(agrupadorNome: string, item: { descricao: string }) {
    console.log(
      `Tentando remover item: ${item.descricao} do agrupador: ${agrupadorNome}`
    );

    // Cria novo array filtrando item a ser removido
    const newListAgrup = this.agrupadoresSelecionados[agrupadorNome].filter(
      (i) => i.descricao !== item.descricao
    );

    // Substitui o array antigo pelo novo
    this.agrupadoresSelecionados[agrupadorNome] = newListAgrup;

    // Força a detecção de mudança para atualizar a grade detalhe
    this.agrupadoresSelecionados = { ...this.agrupadoresSelecionados };
  }

  changeState() {}

  // Função para Confirmar Exclusão de Itens
  confirmarExclusao() {
    if (this.setorEditando) {
      this.setorEditando.itens = this.setorEditando?.itens.filter(
        (item: any) => item != this.itemSelecionadoExcluir
      );
    }
    this.popUpExcluirItem = false;
  }

  fecharPopup(){
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
      (s) => s.id === this.setorEditando!.id
    );

    if (index !== -1) {
      this.setoresList[index] = { ...this.setorEditando! };
      this.setoresList = [...this.setoresList];

      console.log('Setor atualizado e salvo:', this.setoresList[index]);
    } else {
      // Se for um novo setor, você adicionaria ele à lista aqui.
      console.warn(
        'Setor não encontrado para atualização. Isso deveria ser um novo setor?'
      );
    }

    this.drawerAberto = false;

    // Limpar o estado de edição
    this.agrupadoresSelecionados = {};
    this.setorEditando = undefined;
  }

  cancelarAlteracoes(): void {
    this.drawerAberto = false;
  }

  cancelarAlteracoesItens(): void {
    this.popupVisivel = false;
  }
}
