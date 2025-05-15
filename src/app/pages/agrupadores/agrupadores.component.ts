import { Component } from '@angular/core';
import { DxDataGridModule, DxToolbarModule } from 'devextreme-angular';
import { DxiItemModule } from 'devextreme-angular/ui/nested';

@Component({
  selector: 'app-agrupadores',
  standalone: true,
  imports: [DxDataGridModule, DxToolbarModule, DxiItemModule],
  templateUrl: './agrupadores.component.html',
  styleUrl: './agrupadores.component.css'
})
export class AgrupadoresComponent {

}
