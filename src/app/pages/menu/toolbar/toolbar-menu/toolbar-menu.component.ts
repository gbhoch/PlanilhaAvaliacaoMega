import { Component, inject } from '@angular/core';
import { DxToolbarModule, DxButtonModule, DxListModule } from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import notify from 'devextreme/ui/notify';
import { MenuToolbarService } from '../../../../services/menu-toolbar.service';
import { MenuComponent } from '../../menu.component';

@Component({
  selector: 'app-toolbar-menu',
  standalone: true,
  imports: [DxToolbarModule, DxButtonModule, DxListModule],
  templateUrl: './toolbar-menu.component.html',
  styleUrl: './toolbar-menu.component.css'
})


export class ToolbarMenuComponent {

  // private menuToolbar = inject(MenuToolbarService);
  isDrawerOpen: boolean = false;

  constructor (private toolbarService : MenuToolbarService) {}

  // public SidenavOpen(toolbar : MenuComponent){
  //   this.isDrawerOpen = !this.isDrawerOpen;
  // }
  SidenavOpen : DxButtonTypes.Properties = {
    icon: 'menu',
    onClick : () => {
      notify('.');
    }
  };
}
