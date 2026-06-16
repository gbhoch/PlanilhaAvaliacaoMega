import { SetoresService } from './../../services/setores.service';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DxButtonModule,
  DxDataGridModule,
  DxPopupModule,
} from 'devextreme-angular';
import { SetorInterface } from '../../models/interfaces/setores.interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-setores',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './setores.component.html',
  styleUrl: './setores.component.css',
})
export class SetoresComponent implements OnDestroy {
  setoresList: SetorInterface[] = [];
  listaDataSource: any;
  subs: Subscription[] = [];

  novoSetor: string = '';
  novoSetorNome: string = '';
  setorEditando?: SetorInterface;
  isNovoSetor = false;

  popupNovoSetorVisivel = false;
  popupExcluirVisible = false;

  indexParaExcluir: number | null = null;
  setorParaExcluir?: SetorInterface;
  selectedSetor: SetorInterface = {} as SetorInterface;
  drawerAberto = false;

  constructor(private setoresService: SetoresService) {
    this.setoresService.getSetores().subscribe((setores) => {
      this.setoresList = setores;
    });
  }
  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  openDrawer() {
    this.setorEditando = {
      id: Date.now(),
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
      planoDeAvaliacao: [],
    };
    this.isNovoSetor = true;
    this.drawerAberto = true;
  }

  onCellDblClick(e: any) {
    if (e.data) {
      this.setorEditando = JSON.parse(JSON.stringify(e.data));
      this.isNovoSetor = false; // sinaliza que esta editando
      this.drawerAberto = true;
    }
  }

  adicionarSetor() {
    if (this.setorEditando && this.novoSetor.trim()) {
      if (!this.setorEditando.itens) {
        this.setorEditando.itens = [];
      }

      this.setorEditando.itens.push({ descricao: this.novoSetor.trim() });
      this.novoSetor = '';
    }
  }

  salvarNovoSetor() {
    if (this.novoSetorNome.trim()) {
      this.setoresList = [
        ...this.setoresList,
        {
          id: Date.now(),
          nome: this.novoSetorNome.trim(),
          itens: [],
          ativo: false,
          planoDeAvaliacao: []
        },
      ];
    }
    this.popupNovoSetorVisivel = false;
  }

  cancelarNovoSetor() {
    this.popupNovoSetorVisivel = false;
  }

  salvarAlteracoes() {
    if (!this.setorEditando) return;

    if (this.isNovoSetor) {
      this.subs.push(
        this.setoresService.addSetor(this.setorEditando).subscribe({
          next: () => {
            this.recarregarLista();
            this.fecharDrawer();
          },
          error: (err) => console.error('Erro ao adicionar setor:', err)
        })
      );
    } else {
      this.subs.push(
        this.setoresService.updateSetor(this.setorEditando).subscribe({
          next: () => {
            this.recarregarLista();
            this.fecharDrawer();
          },
          error: (err) => console.error('Erro ao atualizar setor:', err)
        })
      );
    }
  }

  cancelarAlteracoes() {
    this.fecharDrawer();
  }

  private fecharDrawer() {
    this.drawerAberto = false;
    this.setorEditando = undefined;
    this.isNovoSetor = false;
  }

  confirmarExclusao() {
    if (this.setorParaExcluir) {
      this.subs.push(
        this.setoresService.removerSetor(this.setorParaExcluir).subscribe({
          next: () => {
            this.recarregarLista();
            this.setorParaExcluir = undefined;
            this.fecharPopup();
          },
          error: (err) => console.error('Erro ao remover setor:', err)
        })
      );
    }
  }

  private recarregarLista() {
    this.subs.push(
      this.setoresService.getSetores().subscribe(setores => {
        this.setoresList = setores;
      })
    );
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
        this.setorParaExcluir = e.row.data;
        this.popupExcluirVisible = true;
      },
    },
  ];
}
