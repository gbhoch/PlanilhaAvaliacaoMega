import { planilhaInterface } from '../../models/interfaces/planilha.interface';
import { Component } from '@angular/core';
import { DxDataGridModule, DxToolbarModule, DxButtonModule, DxDrawerModule, DxTemplateModule } from 'devextreme-angular';
import { SetorInterface } from '../../models/interfaces/setores.interface';
import { SensoInterface } from '../../models/interfaces/senso.interface';


@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [DxDataGridModule, DxToolbarModule, DxButtonModule, DxDrawerModule, DxTemplateModule],
  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.css'
})
export class AvaliacaoComponent {

  setoresList: SetorInterface[] = [];
  agrupadoresList: SensoInterface[] = [];

  drawerAberto = false;

  openPlanilhas(){
    this.drawerAberto = true;
    console.log('click')
  }

  changeState(){

  }

  salvarAlteracoes(){

  }

  cancelarAlteracoes(){

  }
}
