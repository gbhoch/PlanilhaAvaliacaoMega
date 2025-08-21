import { AgrupadoresService } from './../../services/agrupadores.service';
import { Component } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxPopupModule,
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

  itensSelecionados: any[] = [];

  agrupadorEditando: any = null;

  selectedAgrupador?: SensoInterface | undefined;
  drawerAberto = false;

  novoItem: string = '';

  popupEditarNomeVisible = false;
  novoNomeAgrupador: string = '';

  popupExcluirVisible = false;
  indexParaExcluir: number | null = null;

  abaSelecionada: 'descricao' | 'itens' = 'descricao';

  novoAgrupadorNome: string = '';
  isNovoAgrupador = false;

  itemSelecionadoParaExcluir: any = null;
  modoEdicao = false;

  constructor(
    private AgrupadoresService: AgrupadoresService,
    private router: Router
  ) {
    console.log('AgrupadoresComponent');
    this.AgrupadoresService.getAgrupList().subscribe((data) => {
      this.agrupadoresList = data;
    });
  }

  openDrawer(): void {
    this.agrupadorEditando = {
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
    };
    this.modoEdicao = false;
    this.drawerAberto = true;
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
  }

  onCellClick(event: any): void {
    const agrupador = event.data;
    if (!agrupador) return;

    this.itensSelecionados = agrupador.itens || [];
  }

  onCellDblClick(event: any): void {
    const agrupador = event.data;
    if (!agrupador) return;

    // Faz uma cópia para evitar mutações diretas
    this.agrupadorEditando = {
      ...agrupador,
      itens: [...agrupador.itens],
    };

    this.modoEdicao = true;
    this.drawerAberto = true;
  }

  confirmarEdicaoNome() {
    if (this.selectedAgrupador && this.novoNomeAgrupador.trim()) {
      this.selectedAgrupador.nome = this.novoNomeAgrupador.trim();
      this.salvarAlteracoes(); // se já tiver esse método
    }
    this.popupEditarNomeVisible = false;
  }

  salvarAlteracoes(): void {
    if (!this.agrupadorEditando.nome) return;

    if (this.modoEdicao) {
      // Edição: atualiza no array
      const index = this.agrupadoresList.findIndex(
        (a) => a.nome === this.agrupadorEditando.nome
      );
      if (index !== -1) {
        this.agrupadoresList[index] = { ...this.agrupadorEditando };
      }
    } else {
      // Criação: adiciona ao array
      this.agrupadoresList.push({ ...this.agrupadorEditando });
    }

    this.drawerAberto = false;
  }

  cancelarAlteracoes(): void {
    this.drawerAberto = false;
    this.agrupadorEditando = null;
    this.novoItem = '';
  }

  adicionarItem(): void {
    if (this.novoItem?.trim()) {
      this.agrupadorEditando.itens.push({ descricao: this.novoItem.trim() });
      this.novoItem = '';
    }
  }

  excluirItem(index: number) {
    if (this.agrupadorEditando?.itens) {
      this.agrupadorEditando.itens.splice(index, 1);
    }
  }

  confirmarExclusao(): void {
    this.agrupadorEditando.itens = this.agrupadorEditando.itens.filter(
      (item: any) => item !== this.itemSelecionadoParaExcluir
    );
    this.popupExcluirVisible = false;
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
      onClick: (e: any) => {
        this.itemSelecionadoParaExcluir = e.row.data;
        this.popupExcluirVisible = true;
      },
    },
  ];
}
