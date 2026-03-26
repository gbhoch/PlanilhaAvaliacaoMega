import { SetorInterface } from './../../models/interfaces/setores.interface';
import { Component } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxDropDownBoxModule, DxListModule, DxSelectBoxModule } from 'devextreme-angular';
import { SetoresService } from '../../services/setores.service';

@Component({
  selector: 'avaliar-planilha',
  standalone: true,
  imports: [ DxListModule, DxDataGridModule, DxButtonModule, DxSelectBoxModule],
  templateUrl: './avaliar-planilha.component.html',
  styleUrl: './avaliar-planilha.component.css'
})
export class AvaliarPlanilhaComponent {

  planilhasList : SetorInterface[] = [];

  constructor(
    private setoresService : SetoresService
  ) {
    this.setoresService.getSetores().subscribe((planilhas) => {
      console.log("Planilhas", planilhas);
      this.planilhasList = planilhas
    })
  }

}
