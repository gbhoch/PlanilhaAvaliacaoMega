import { subscribe } from 'diagnostics_channel';
import { AgrupadoresService } from './../../services/agrupadores.service';
import { Component } from '@angular/core';
import { DxDataGridModule, DxToolbarModule } from 'devextreme-angular';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { Agrupadores } from '../../models/Agrupadores';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agrupadores',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxToolbarModule, DxiItemModule],
  templateUrl: './agrupadores.component.html',
  styleUrl: './agrupadores.component.css'
})
export class AgrupadoresComponent {

  agrupadoresList : Agrupadores [] = [];
  listDataSource : any;

  constructor (private AgrupadoresService : AgrupadoresService){
    console.log('AgrupadoresComponent')
    this.AgrupadoresService.getAgrupList().subscribe(data => {
      this.agrupadoresList = data
    });
  }
}
