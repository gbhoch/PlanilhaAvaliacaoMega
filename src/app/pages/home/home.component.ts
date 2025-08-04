import { AddItemVerifComponent } from './../add-item-verif/add-item-verif.component';
import { ItensVerificados } from './../../models/ItensVerificados';
import { ItensVerificadosService } from './../../services/itens-verificados.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import themes from 'devextreme/ui/themes';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, DxDataGridModule, DxButtonModule, AddItemVerifComponent, FormsModule]
})

export class HomeComponent implements OnInit {

  itensVerificados : ItensVerificados[] = [];
  listDatasource: any;

  allMode : string | undefined;
  checkBoxesMode : string | undefined;

  @ViewChild('modalAddItem')
  private modal?: AddItemVerifComponent

  constructor (
    private ItensVerificadosService : ItensVerificadosService){

    this.ItensVerificadosService.getItensVerificados().subscribe(data => {
      this.itensVerificados = data
    });

    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('') ? 'always' : 'onClick';
  }

  ngOnInit(): void {}

  showModal = () => {
    this.modal?.showModal();
  }
}

