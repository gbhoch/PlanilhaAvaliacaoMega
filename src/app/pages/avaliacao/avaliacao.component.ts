import { Data } from 'devextreme-angular/common';
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
import { AgrupadoresService } from '../../services/agrupadores.service';
import { ItemAvaliacaoInterface } from '../../models/interfaces/item-avaliacao.interface';
import { ItensVerificados } from '../../models/ItensVerificados';

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
  itensSelecionadosTemp: { id?: number; descricao: string }[] = [];
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
    [agrupadorNome: string]: { id: number; descricao: string }[]; // nome do agrupador → itens selecionados
  } = {};

  agrupadoresExpandidos: {
    [agrupadorNome: string]: boolean;
  } = {};

  abrirDrawerSetor(setor: SetorInterface) {
    this.setorEditando = { ...setor }; // Faz cópia para edição
    this.drawerAberto = true;

    type PlanoBrutoItem = { descricao: string, id?: number };

    const planoProcessado: {
      [agrupadorNome: string]: ItemAvaliacaoInterface[];
    } = {};

    const planoBruto: {[key: string]: PlanoBrutoItem[]} = (setor.planoDeAvaliacao as any) || [];

    if (planoBruto) {
      for (const agrupadorNome in planoBruto) {
        if (planoBruto.hasOwnProperty(agrupadorNome)) {
          // Mapeia os itens do agrupador, garantindo que cada um tenha um ID
          planoProcessado[agrupadorNome] = planoBruto[agrupadorNome].map(
            (item : PlanoBrutoItem): ItemAvaliacaoInterface => {
              return {
                descricao: item.descricao,
                id: item.id || this.generateUniqueId(),
              };
            }
          );
        }
      }
    }
    this.agrupadoresSelecionados = planoProcessado;
  }

  onCellDblClick(evt: any) {
    const setor = evt.data;
    if (!setor) return;

    type PlanoBrutoItem = {
      map: any; descricao: string, id?: number
    };

    this.setorEditando = { ...setor };
    this.modoEdicao = true;
    this.drawerAberto = true;

    const planoProcessado: {
      [agrupadorNome : string] : ItemAvaliacaoInterface[];
    } = {};

    const planoBruto: { [key: string]: PlanoBrutoItem} = (setor.planoDeAvaliacao as any) || [];

    if(planoBruto){
      for (const agrupadorNome in planoBruto){
        if(planoBruto.hasOwnProperty(agrupadorNome)){
          planoProcessado[agrupadorNome] = planoBruto[agrupadorNome].map(
            (item: PlanoBrutoItem): ItemAvaliacaoInterface => {
              return {
                descricao : item.descricao,
                id: item.id || this.generateUniqueId()
              };
            }
          );
        }
      }
    }
    this.agrupadoresSelecionados = planoProcessado;
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
    this.itensSelecionaveis =
      agrupador?.itens?.map((i: any) => ({ descricao: i.descricao })) ?? [];

    const itensSalvos = this.agrupadoresSelecionados[agrupadorNome] || [];

    this.itensSelecionadosTemp = [];
    const descricoesSalvas = new Set(itensSalvos.map((i) => i.descricao));

    this.itensSelecionadosTemp = this.itensSelecionaveis.filter((item) =>
      descricoesSalvas.has(item.descricao)
    );

    this.popupVisivel = true;
    this.agrupadoresExpandidos[agrupadorNome] = true;
  }

  confirmarSelecaoItens() {
    const itensAtuaisSalvos =
      this.agrupadoresSelecionados[this.agrupadorAtual] || [];

    const mapaIdsSalvos = new Map(
      itensAtuaisSalvos.map((item) => [item.descricao, item.id])
    );

    const novosItensComId: { id: number; descricao: string }[] =
      this.itensSelecionadosTemp.map((item) => {
        const idSalvo = mapaIdsSalvos.get(item.descricao);

        return {
          descricao: item.descricao,
          id: idSalvo || this.generateUniqueId(),
        };
      });

    // 3. Salva a nova lista no agrupador
    this.agrupadoresSelecionados[this.agrupadorAtual] = novosItensComId;
    this.agrupadoresSelecionados = { ...this.agrupadoresSelecionados };

    this.popupVisivel = false;
    this.itensSelecionadosTemp = []; // Limpa a lista temporária
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

  getBotaoRemover(event: any) {    /* getDetalhesButtons */
    console.log(event)
    // return [
    //   {
    //     hint: 'Remover',
    //     icon: 'trash',
    //     onClick: (e: any) => {
    //       this.itemSelecionadoExcluir = e.row.data;
    //       this.agrupadorAtual = agrupadorNome;
    //       this.popUpExcluirItem = true;
    //     },
    //   },
    // ];
  }

  onReorderItem(agrupadorNome: string, e: any) {
    const lista = this.agrupadoresSelecionados[agrupadorNome];
    if (!lista) return;

    const itemMovido = lista.splice(e.fromIndex, 1)[0];
    lista.splice(e.toIndex, 0, itemMovido);

    this.agrupadoresSelecionados[agrupadorNome] = lista;
    setTimeout(() => {
      this.agrupadoresSelecionados = {...this.agrupadoresSelecionados};
    }, 0);
  }

  // botaoRemoverItem = [
  //   {
  //     hint: 'Remover',
  //     icon: 'trash',
  //     onClick: (e: any) => {
  //       this.removerItemSelecionado(this.itemSelecionadoExcluir, e.row.data);
  //       this.popUpExcluirItem = true;
  //     },
  //   },
  // ];

  removerItemSelecionado(agrupadorNome: string, item: { id: number, descricao: string }) {
    console.log(
      `Tentando remover item: ${item.descricao} do agrupador: ${agrupadorNome}`
    );

    const newListAgrup = this.agrupadoresSelecionados[agrupadorNome].filter(
      (i) => i.id !== item.id
    );

    // Substitui o array antigo pelo novo
    this.agrupadoresSelecionados[agrupadorNome] = newListAgrup;

    // Força a detecção de mudança para atualizar a grade detalhe
    this.agrupadoresSelecionados = { ...this.agrupadoresSelecionados };
  }

  confirmarExclusao() {
    if (this.agrupadorAtual && this.itemSelecionadoExcluir){
      this.removerItemSelecionado(this.agrupadorAtual, this.itemSelecionadoExcluir);

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
      (s) => s.id === this.setorEditando!.id
    );

    if (index !== -1) {
      this.setoresList[index] = { ...this.setorEditando! };
      this.setoresList = [...this.setoresList];

      console.log('Setor atualizado e salvo:', this.setoresList[index]);
    } else {
      // Se for um novo setor, adicionaria ele à lista aqui.
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
