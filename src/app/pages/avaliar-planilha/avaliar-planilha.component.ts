import { Component } from '@angular/core';
import { DxButtonGroupModule, DxButtonModule, DxDataGridModule, DxDropDownBoxModule, DxListModule } from 'devextreme-angular';
import { AgrupadoresService } from '../../services/agrupadores.service';

@Component({
  selector: 'avaliar-planilha',
  standalone: true,
  imports: [DxDropDownBoxModule, DxListModule, DxDataGridModule, DxButtonModule],
  templateUrl: './avaliar-planilha.component.html',
  styleUrl: './avaliar-planilha.component.css'
})
export class AvaliarPlanilhaComponent {

  constructor(
    private listaAgrup : AgrupadoresService
  ) {}

}
