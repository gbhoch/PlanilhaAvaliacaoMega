import { AddItens } from './../../models/AddItens';
import { AddItensService } from './../../services/add-itens.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import { startWith } from 'rxjs';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-add-item-verif',
  standalone: true,
  imports: [CommonModule /*, NgIf*/, HomeComponent, DxDataGridModule, DxSelectBoxModule],
  templateUrl: './add-item-verif.component.html',
  template: `
    <ng-content/>
  `,
  styleUrl: './add-item-verif.component.css'
})
export class AddItemVerifComponent {

  add : AddItens [] = [];

  checkboxes = [];

  allMode : string | undefined;
  checkBoxesMode : string | undefined;

  @ViewChild('modal')
  private modal?: ElementRef<HTMLDialogElement>

  constructor (private AddItensService : AddItensService){
    this.AddItensService.getAddItens().subscribe(data => {
      this.add = data
      console.log(data)
    });

    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('') ? 'always' : 'onClick';
  }

  showModal(){
    (this.modal?.nativeElement as HTMLDialogElement).showModal();
  }

  checkboxChange(){}

  closeModal(){
    (this.modal?.nativeElement as HTMLDialogElement).close();
  }

}
