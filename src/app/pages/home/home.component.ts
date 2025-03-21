import { AddItemVerifComponent } from './../add-item-verif/add-item-verif.component';
import { ItensVerificadosService } from './../../services/itens-verificados.service';
import { FuncionarioService } from './../../services/funcionario.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Funcionario } from '../../models/Funcionario';
import { ItensVerificados } from '../../models/ItensVerificados';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NgFor, CommonModule, AddItemVerifComponent]
})

export class HomeComponent implements OnInit {

  itensVerificados : ItensVerificados[] = [];
  itensVerificadosGeral : ItensVerificados[] = [];

  constructor (private ItensVerificadosService : ItensVerificadosService){}

  ngOnInit(): void {
    this.ItensVerificadosService.GetItensVerificados().subscribe(data => {
      const dados = data.dados;

      dados.map((item) => {                                                                     // .map percorre todos itens e transforma em outro array
        item.dataDeCriacao = new Date(item.dataDeCriacao!).toLocaleDateString('pt-BR');
        item.dataDeModificacao = new Date(item.dataDeModificacao!).toLocaleDateString('pt-BR');
      })

      this.itensVerificados = data.dados;
      this.itensVerificadosGeral = data.dados;
    })
  }

  @ViewChild('openModal') openModal! : AddItemVerifComponent;
  ngOnOpenModal(){
    this.openModal.toggle();
  }



}
/*
export class HomeComponent implements OnInit {

  funcionarios : Funcionario[] = [];
  funcionarioGeral : Funcionario[] = [];

  constructor (private FuncionarioService : FuncionarioService){}

  ngOnInit(): void {
    this.FuncionarioService.GetFuncionario().subscribe(data => {
      const dados = data.dados;

      dados.map((item) => {
        item.dataDeCriacao = new Date(item.dataDeCriacao!).toLocaleDateString('pt-BR');
        item.dataDeModificacao = new Date(item.dataDeModificacao!).toLocaleDateString('pt-BR');
      })

      this.funcionarios = data.dados;
      this.funcionarioGeral = data.dados;
    })
  }

}*/
