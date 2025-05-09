import { Component } from '@angular/core';
import { DxToolbarModule, DxButtonModule, DxListModule } from 'devextreme-angular';

@Component({
  selector: 'app-toolbar-menu',
  standalone: true,
  imports: [DxToolbarModule, DxButtonModule, DxListModule],
  templateUrl: './toolbar-menu.component.html',
  styleUrl: './toolbar-menu.component.css'
})


export class ToolbarMenuComponent {

  isDrawerOpen: boolean = false;

  openSidenav(){
    console.log('click')
    this.isDrawerOpen = !this.isDrawerOpen;
  }

}
