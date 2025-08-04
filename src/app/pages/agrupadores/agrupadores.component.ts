import { AgrupadoresService } from './../../services/agrupadores.service';
import { Component } from '@angular/core';
import {
  DxButtonComponent,
  DxButtonModule,
  DxDataGridModule,
  DxPopupModule,
  DxTemplateModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensoInterface } from '../../models/interfaces/senso.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agrupadores',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxToolbarModule,
    DxiItemModule,
    FormsModule,
    DxPopupModule,
    DxDataGridModule,
    DxButtonModule,
  ],
  templateUrl: './agrupadores.component.html',
  styleUrl: './agrupadores.component.css',
})
export class AgrupadoresComponent {
  agrupadoresList: SensoInterface[] = [];
  listDataSource: any;

  agrupadorEditando?: SensoInterface;

  selectedAgrupador?: SensoInterface | undefined;
  drawerAberto = false;

  novoItem: string = '';

  popupEditarNomeVisible = false;
  novoNomeAgrupador: string = '';

  popupExcluirVisible = false;
  indexParaExcluir: number | null = null;

  abaSelecionada: 'descricao' | 'itens' = 'descricao';

  popupNovoAgrupadorVisivel = false;
  novoAgrupadorNome: string = '';

  constructor(
    private AgrupadoresService: AgrupadoresService,
    private router: Router
  ) {
    console.log('AgrupadoresComponent');
    this.AgrupadoresService.getAgrupList().subscribe((data) => {
      this.agrupadoresList = data;
    });
  }

  PopupNovoAgrupador() {
    this.novoAgrupadorNome = '';
    this.popupNovoAgrupadorVisivel = true;
  }

  cancelarNovoAgrupador() {
    this.popupNovoAgrupadorVisivel = false;
  }

  salvarNovoAgrupador() {
    if (this.novoAgrupadorNome.trim()) {
      this.agrupadoresList = [
        ...this.agrupadoresList,
        {
          nome: this.novoAgrupadorNome.trim(),
          itens: [],
          ativo: false,
        },
      ];
    }
    this.popupNovoAgrupadorVisivel = false;
  }

  onCellDblClick(e: any) {
    if (e.column?.dataField === 'nome') {
      this.selectedAgrupador = e.data;
      this.agrupadorEditando = JSON.parse(JSON.stringify(e.data)); // Deep copy
      this.drawerAberto = true;

      if (this.selectedAgrupador) {
        if (!this.selectedAgrupador.itens) {
          this.selectedAgrupador.itens = [];
        }
        this.drawerAberto = true;
      }
    }
  }

  abrirPopupEditar() {
    if (this.selectedAgrupador) {
      this.novoNomeAgrupador = this.selectedAgrupador.nome;
      this.popupEditarNomeVisible = true;
    }
  }

  confirmarEdicaoNome() {
    if (this.selectedAgrupador && this.novoNomeAgrupador.trim()) {
      this.selectedAgrupador.nome = this.novoNomeAgrupador.trim();
      this.salvarAlteracoes(); // se já tiver esse método
    }
    this.popupEditarNomeVisible = false;
  }

  salvarAlteracoes() {
    if (this.selectedAgrupador && this.agrupadorEditando) {
      const index = this.agrupadoresList.indexOf(this.selectedAgrupador);

      if (index !== -1) {
        // Adiciona a data e atualiza
        this.agrupadorEditando.dataDeModificacao = new Date()
          .toISOString()
          .slice(0, 10);

        this.agrupadoresList[index] = { ...this.agrupadorEditando };
      }

      this.drawerAberto = false;
      this.selectedAgrupador = undefined;
      this.agrupadorEditando = undefined;
    }
  }

  cancelarAlteracoes(){
    this.drawerAberto = false;
  }

  adicionarItem() {
    if (this.agrupadorEditando && this.novoItem.trim()) {
      if (!this.agrupadorEditando.itens) {
        this.agrupadorEditando.itens = [];
      }

      this.agrupadorEditando.itens.push({ descricao: this.novoItem.trim() });
      this.novoItem = '';
    }
  }

  excluirItem(index: number) {
    if (this.agrupadorEditando?.itens) {
      this.agrupadorEditando.itens.splice(index, 1);
    }
  }

  confirmarExclusao() {
    if (this.agrupadorEditando?.itens && this.indexParaExcluir !== null) {
      this.agrupadorEditando.itens.splice(this.indexParaExcluir, 1);
    }

    this.fecharPopup();
  }

  fecharPopup() {
    this.popupExcluirVisible = false;
    this.indexParaExcluir = null;
  }

  abrirPopupConfirmacao(index: number) {
    this.indexParaExcluir = index;
    this.popupExcluirVisible = true;
  }

  botaoExcluir = [
    {
      hint: 'Excluir',
      icon: 'trash',
      onClick: (e: any) => this.abrirPopupConfirmacao(e.rowIndex),
    },
  ];
}
