import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DxDrawerModule, DxListModule, DxToolbarModule } from 'devextreme-angular';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DxDrawerModule, DxToolbarModule, DxListModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  navigation: any[] = [
    { id: 1, text: "Inbox", icon: "", path: "login" },
    { id: 2, text: "Agrupadores", icon: "", path: "planilha" },
    { id: 3, text: "Planilha de Avaliação", icon: "", path: "menu" },
    { id: 4, text: "Spam", icon: "", path: "login" }
  ];

  isDrawerOpen: boolean = false;

  openSidenav(){
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  menuItemCLick(evt : any){

    console.log(evt)
  }
}
