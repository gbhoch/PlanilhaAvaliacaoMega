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
  setoresList: SetorInterface[] = [];
  agrupadoresList: SensoInterface[] = [];
  itensList: ItensVerificados[] = []; // Interafce de Itens Verificados
  agrupadoresDataGrid: { agrupador: string; descricao: string }[] = [];

  isNovaPlanilha = false;
  setorEditando?: SetorInterface;

  drawerAberto = false;
  popupVisivel = false;
  agrupadorAtual = '';
  itensSelecionaveis: string[] = [];
  itensSelecionadosTemp: { descricao: string }[] = [];

  constructor(
    public menuService: MenuToolbarService,
    private agrupadoresService: AgrupadoresService,
    private setoresService: SetoresService,
    private itensVerifService : ItensVerificadosService
  ) {
    this.setoresService.getSetores().subscribe((setores) => {
      console.log('Setores carregador:', setores);
      this.setoresList = setores;
    });

    this.agrupadoresService.getAgrupList().subscribe((data) => {
      this.agrupadoresList = data;
      console.log("AvaliacaoComponent", data)
    });

    this.itensVerifService.getItensVerificados().subscribe((itens) => {
      this.itensList = itens;
      console.log("ItensVerif", itens)
    })
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
  }

  openPlanilhas() {
    this.drawerAberto = true;
    this.setorEditando = {
      id: 1,
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
    };

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

    const agrupador = this.agrupadoresList.find(
      (a) => a.nome === agrupadorNome
    );
    this.itensSelecionaveis = agrupador?.itens?.map((i) => i.descricao) ?? [];

    this.itensSelecionadosTemp =
      this.agrupadoresSelecionados[agrupadorNome] || [];
    this.popupVisivel = true;
    this.agrupadoresExpandidos[agrupadorNome] = true;
  }

  rowDraggingConfig(agrupadorNome: string) {
    return {
      allowReordering: true,
      onReorder: (e: any) => this.onReorderItem(agrupadorNome, e),
    };
  }

  confirmarSelecaoItens() {
    this.agrupadoresSelecionados[this.agrupadorAtual] = [
      ...this.itensSelecionadosTemp,
    ];

    // Atualiza a lista para o data grid com agrupamento
    this.atualizarAgrupadoresDataGrid();

    this.popupVisivel = false;
  }

  atualizarAgrupadoresDataGrid() {
    this.agrupadoresDataGrid = [];

    for (const agrupador in this.agrupadoresSelecionados) {
      const itens = this.agrupadoresSelecionados[agrupador];
      itens.forEach((item) => {
        this.agrupadoresDataGrid.push({
          agrupador: agrupador,
          descricao: item.descricao,
        });
      });
    }
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
    const itemMovido = lista.splice(e.fromIndex, 1)[0];
    lista.splice(e.toIndex, 0, itemMovido);
  }

  removerItemSelecionado(agrupadorNome: string, item: { descricao: string }) {
    this.agrupadoresSelecionados[agrupadorNome] = this.agrupadoresSelecionados[
      agrupadorNome
    ].filter((i) => i.descricao !== item.descricao);
  }

  changeState() {}

  salvarAlteracoes() {}

  cancelarAlteracoes() {}
}
