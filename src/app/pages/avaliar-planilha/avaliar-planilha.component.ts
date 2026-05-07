import { CommonModule } from '@angular/common';
import { SetorInterface } from './../../models/interfaces/setores.interface';
import { Component } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxListModule, DxSelectBoxModule } from 'devextreme-angular';
import { SetoresService } from '../../services/setores.service';
import { SensoInterface } from '../../models/interfaces/senso.interface';
import { ItemAvaliacaoInterface } from '../../models/interfaces/item-avaliacao.interface';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'avaliar-planilha',
  standalone: true,
  imports: [ DxListModule, DxDataGridModule, DxButtonModule, DxSelectBoxModule, DxDateBoxModule],
  templateUrl: './avaliar-planilha.component.html',
  styleUrl: './avaliar-planilha.component.css'
})
export class AvaliarPlanilhaComponent {

  dataAvaliacao : Date = new Date();
  planilhasList : SetorInterface[] = [];
  setorSelecionadoId: number | null = null;
  gridData: { agrupador: string; item: string} [] = [];

  constructor(
    private setoresService : SetoresService
  ) {
    this.setoresService.getSetores().subscribe((planilhas) => {
      this.planilhasList = planilhas
    });
  }

  onSetorSelecionado(e:any){
    const setor = this.planilhasList.find(s => s.id === e.value)
    if (!setor?.planoDeAvaliacao) {
      this.gridData = [];
      return
    }

    this.gridData = setor.planoDeAvaliacao.flatMap((agrupador: SensoInterface) =>
      (agrupador.itens ??[]).map((item: ItemAvaliacaoInterface) => ({
        agrupador: agrupador.nome,
        item: item.descricao
      })))
  };
}
