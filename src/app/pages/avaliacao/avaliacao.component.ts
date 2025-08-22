import { planilhaInterface } from '../../models/interfaces/planilha.interface';
import { Component } from '@angular/core';
import { DxDataGridModule, DxToolbarModule, DxButtonModule, DxDrawerModule, DxTemplateModule } from 'devextreme-angular';
import { SetorInterface } from '../../models/interfaces/setores.interface';
import { SensoInterface } from '../../models/interfaces/senso.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuToolbarService } from '../../services';


@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [DxDrawerModule,
  DxButtonModule,
  DxTemplateModule,
  FormsModule,
  CommonModule,
  DxDataGridModule],
  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.css'
})
export class AvaliacaoComponent {

  setoresList: SetorInterface[] = [];
  agrupadoresList: SensoInterface[] = [];

  isNovaPlanilha = false;
  setorEditando?: SetorInterface;

  drawerNovo: boolean = false;

  constructor(
    public menuService : MenuToolbarService
  ){}

  openPlanilhas(evt : any){
    this.drawerNovo = true;
    this.setorEditando = {
      id: 1,
      nome: '',
      descricao: '',
      ativo: true,
      itens: [],
    };
    console.log('Botão clicado, abrindo novo drawer.');
  }

  fecharNovoDrawer() {
    this.drawerNovo = false;
  }

  // ... outros métodos


  // openDrawer() {
  //   this.setorEditando = {
  //     id: 1,
  //     nome: '',
  //     descricao: '',
  //     ativo: true,
  //     itens: [],
  //   };
  //   this.isNovaPlanilha = true;
  //   this.drawerAberto = true;
  //   console.log('click')
  // }

  changeState(){

  }

  salvarAlteracoes(){

  }

  cancelarAlteracoes(){

  }
}
