import { SetoresService } from './../../services/setores.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DxButtonModule,
  DxDataGridModule,
  DxPopupModule,
} from 'devextreme-angular';
import { SetorInterface } from '../../models/interfaces/setores.interface';
import { CommonModule } from '@angular/common';

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
export class SetoresComponent {
  setoresList: SetorInterface[] = [];
  listaDataSource: any;

  novoSetor: string = '';
  novoSetorNome: string = '';
  setorEditando?: SetorInterface;
  isNovoSetor = false;

  popupNovoSetorVisivel = false;
  popupExcluirVisible = false;

  indexParaExcluir: number | null = null;

  selectedSetor: SetorInterface = {} as SetorInterface;
  drawerAberto = false;

  constructor(private setoresService: SetoresService) {
    this.setoresService.getSetores().subscribe((setores) => {
      this.setoresList = setores;
    });
  }

  openDrawer() {
    this.setorEditando = {
      id: 1,
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
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
          id: 1,
          nome: this.novoSetorNome.trim(),
          itens: [],
          ativo: false,
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
      this.setoresService.addSetor(this.setorEditando); // ← Adiciona novo
    } else {
      this.setoresService.updateSetor(this.setorEditando); // ← Atualiza existente
    }

    this.fecharDrawer();
  }

  cancelarAlteracoes() {
    // Apenas fecha o drawer e limpa, sem salvar nada
    this.fecharDrawer();
  }

  private fecharDrawer() {
    this.drawerAberto = false;
    this.setorEditando = undefined;
    this.isNovoSetor = false;
  }

  confirmarExclusao() {
    if (this.setorEditando?.itens && this.indexParaExcluir !== null) {
      this.setorEditando.itens.splice(this.indexParaExcluir, 1);
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
