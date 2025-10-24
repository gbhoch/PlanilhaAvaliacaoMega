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
import notify from 'devextreme/ui/notify';

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
      id: Date.now(),
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
          id: Date.now(),
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
    this.selectedAgrupador = agrupador;
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
    if (!this.agrupadorEditando || !this.agrupadorEditando.nome) {
      notify(
        {
          message: 'Nome do Agrupador não definido!',
          type: 'warning',
          displayTime: 3000,
          width: 300
        },
        { direction: 'up-stack', position: 'top center' }
      );
      return;
    }

    if (this.modoEdicao) {
      this.AgrupadoresService.updateAgrupador(this.agrupadorEditando);
    } else {
      this.AgrupadoresService.addAgrupador(this.agrupadorEditando);
    }

    this.drawerAberto = false;
    this.agrupadorEditando = null;
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

  abrirEdicao(data: any): void {
    if (data) {
      this.agrupadorEditando = JSON.parse(JSON.stringify(data));
      this.modoEdicao = true;
      this.drawerAberto = true;
    }
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

  botaoEditar = [
    {
      hint: 'Editar',
      icon: 'edit',
      onClick: (e: any) => {
        this.abrirEdicao(e.row.data);
      },
    },
  ];
}
