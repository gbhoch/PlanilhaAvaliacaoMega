import { subscribe } from 'diagnostics_channel';
import { AgrupadoresService } from './../../services/agrupadores.service';
import { Component } from '@angular/core';
import {
  DxDataGridModule,
  DxPopupModule,
  DxTemplateModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { Agrupadores } from '../../models/Agrupadores';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './agrupadores.component.html',
  styleUrl: './agrupadores.component.css',
})
export class AgrupadoresComponent {
  agrupadoresList: Agrupadores[] = [];
  listDataSource: any;

  selectedAgrupador?: Agrupadores | undefined;
  drawerAberto = false;

  novoItem: string = '';

  popupEditarNomeVisible = false;
  novoNomeAgrupador: string = '';

  popupExcluirVisible = false;
  indexParaExcluir: number | null = null;

  abaSelecionada: 'descricao' | 'itens' = 'descricao';

  constructor(private AgrupadoresService: AgrupadoresService) {
    console.log('AgrupadoresComponent');
    this.AgrupadoresService.getAgrupList().subscribe((data) => {
      this.agrupadoresList = data;
    });
  }

  onCellClick(e: any) {
    if (e.column?.dataField === 'nomeAgrup') {
      this.selectedAgrupador = e.data;

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
      this.novoNomeAgrupador = this.selectedAgrupador.nomeAgrup;
      this.popupEditarNomeVisible = true;
    }
  }

  confirmarEdicaoNome() {
    if (this.selectedAgrupador && this.novoNomeAgrupador.trim()) {
      this.selectedAgrupador.nomeAgrup = this.novoNomeAgrupador.trim();
      this.salvarNome(); // se já tiver esse método
    }
    this.popupEditarNomeVisible = false;
  }

  salvarNome() {
    // Aqui você pode chamar serviço para salvar no backend
    if (this.selectedAgrupador) {
      this.selectedAgrupador.dataDeModificacao = new Date()
        .toISOString()
        .slice(0, 10);
    }
  }

  adicionarItem() {
    if (this.novoItem.trim() && this.selectedAgrupador) {
      this.selectedAgrupador.itens!.push(this.novoItem.trim());
      this.novoItem = '';
    }
  }

  excluirItem(index: number) {
    if (this.selectedAgrupador && this.selectedAgrupador.itens) {
      this.selectedAgrupador.itens.splice(index, 1);
    }
  }

  confirmarExclusao() {
    if (this.selectedAgrupador?.itens && this.indexParaExcluir !== null) {
      this.selectedAgrupador.itens.splice(this.indexParaExcluir, 1);
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
}
