import { AddItens } from './../../models/AddItens';
import { AddItensService } from './../../services/add-itens.service';
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'app-add-item-verif',
  standalone: true,
  imports: [CommonModule /*, NgIf*/, HomeComponent, DxDataGridModule],
  templateUrl: './add-item-verif.component.html',
  template: `
    <ng-content/>
  `,
  styleUrl: './add-item-verif.component.css'
})
export class AddItemVerifComponent {

  add : AddItens [] = [];

  @ViewChild('modal')
  private modal?: ElementRef<HTMLDialogElement>

  constructor (private AddItensService : AddItensService){
    this.AddItensService.getAddItens().subscribe(data => {
      this.add = data
      console.log(data)
    });
  }

  showModal(){
    (this.modal?.nativeElement as HTMLDialogElement).showModal();
  }

  closeModal(){
    (this.modal?.nativeElement as HTMLDialogElement).close();
  }

}
