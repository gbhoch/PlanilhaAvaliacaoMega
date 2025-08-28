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

  agrup = ['Senso de Utilização', 'Senso de Organização', 'Senso de Limpeza'];
  dataSource = this.agrup;

  isNovaPlanilha = false;
  setorEditando?: SetorInterface;

  drawerAberto = false;

  popupVisivel = false;
  agrupadorAtual = '';
  itensSelecionaveis: string[] = [];
  itensSelecionadosTemp: string[] = [];

  constructor(public menuService: MenuToolbarService) {}



  agrupadoresSelecionados: {
    [agrupadorNome: string]: string[]; // nome do agrupador → itens selecionados
  } = {};

  itensPorAgrupador: {
    [agrupadorNome: string]: string[];
  } = {
    'Senso de Utilização': ['Item A', 'Item B', 'Item C'],
    'Senso de Organização': ['Item D', 'Item E'],
    'Senso de Limpeza': ['Item F', 'Item G', 'Item H'],
  };

  agrupadoresExpandidos: {
    [agrupadorNome: string]: boolean;
  } = {};




  openPlanilhas() {
    this.drawerAberto = true;
    this.setorEditando = {
      id: 1,
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
    };
    console.log('Botão clicado, abrindo novo drawer.');
  }

  onItemDeleting(e: { cancel: boolean }) {
    if (this.dataSource.length === 1) {
      e.cancel = true;
    }
  }




  abrirSelecaoItens(agrupador: string) {
    this.agrupadorAtual = agrupador;
    this.itensSelecionaveis = this.itensPorAgrupador[agrupador] || [];
    this.itensSelecionadosTemp = this.agrupadoresSelecionados[agrupador] || [];
    this.popupVisivel = true;
    this.agrupadoresExpandidos[agrupador] = true;
  }

  confirmarSelecaoItens() {
    this.agrupadoresSelecionados[this.agrupadorAtual] = [
      ...this.itensSelecionadosTemp,
    ];
    this.popupVisivel = false;
  }

  changeState() {}

  salvarAlteracoes() {}

  cancelarAlteracoes() {}
}
