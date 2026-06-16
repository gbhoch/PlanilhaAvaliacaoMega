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
  styleUrl: './agrupadores.component.scss',
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
      this.AgrupadoresService.updateAgrupador(this.agrupadorEditando).subscribe({
        next: () => {
          this.recarregarLista();
          this.fecharDrawer();
        },
        error: (err) => {
          console.error('Erro ao atualizar agrupador:', err);
          notify({ message: 'Erro ao atualizar agrupador', type: 'error', displayTime: 3000 },
            { direction: 'up-stack', position: 'top center' });
        }
      });
    } else {
      this.AgrupadoresService.addAgrupador(this.agrupadorEditando).subscribe({
        next: () => {
          this.recarregarLista();
          this.fecharDrawer();
        },
        error: (err) => {
          console.error('Erro ao adicionar agrupador:', err);
          notify({ message: 'Erro ao adicionar agrupador', type: 'error', displayTime: 3000 },
            { direction: 'up-stack', position: 'top center' });
        }
      });
    }
  }

  private recarregarLista() {
    this.AgrupadoresService.getAgrupList().subscribe(data => {
      this.agrupadoresList = data;
    });
  }

  private fecharDrawer() {
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
    const item = this.agrupadorEditando?.itens[index];
    if (!item) return;

    // Item novo (sem id) pode ser removido direto — ainda não está no banco
    if (!item.id) {
      this.agrupadorEditando.itens.splice(index, 1);
      return;
    }

    // Item existente — verifica se está em uso antes de remover
    this.AgrupadoresService.verificarUsoItem(item.id).subscribe({
      next: (resultado) => {
        if (resultado.emUso) {
          notify(
            {
              message: 'Este item não pode ser removido pois está sendo usado em um ou mais setores.',
              type: 'warning',
              displayTime: 4000,
              width: 400
            },
            { direction: 'up-stack', position: 'top center' }
          );
          return;
        }

        // Não está em uso — pode remover da lista
        this.agrupadorEditando.itens.splice(index, 1);
      },
      error: (err) => {
        console.error('Erro ao verificar uso do item:', err);
      }
    });
  }

  confirmarExclusao(): void {
    const item = this.itemSelecionadoParaExcluir;
    if (!item) return;

    // Item novo (sem id) — remove direto, ainda não está no banco
    if (!item.id) {
      this.agrupadorEditando.itens = this.agrupadorEditando.itens.filter(
        (i: any) => i !== item
      );
      this.popupExcluirVisible = false;
      return;
    }

    // Item existente — verifica uso antes de remover
    this.AgrupadoresService.verificarUsoItem(item.id).subscribe({
      next: (resultado) => {
        if (resultado.emUso) {
          notify(
            {
              message: 'Este item não pode ser removido pois está sendo usado em um ou mais setores.',
              type: 'warning',
              displayTime: 4000,
              width: 400
            },
            { direction: 'up-stack', position: 'top center' }
          );
          this.popupExcluirVisible = false;
          return;
        }

        // Não está em uso — remove
        this.agrupadorEditando.itens = this.agrupadorEditando.itens.filter(
          (i: any) => i !== item
        );
        this.popupExcluirVisible = false;
      },
      error: (err) => {
        console.error('Erro ao verificar uso do item:', err);
        this.popupExcluirVisible = false;
      }
    });
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
