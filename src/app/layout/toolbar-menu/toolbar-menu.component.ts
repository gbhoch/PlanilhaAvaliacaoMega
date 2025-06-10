import { Component } from '@angular/core';
import { DxToolbarModule, DxButtonModule } from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { MenuToolbarService } from '../../services';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-toolbar-menu',
  standalone: true,
  imports: [DxToolbarModule, DxButtonModule, NgIf],
  templateUrl: './toolbar-menu.component.html',
  styleUrl: './toolbar-menu.component.scss'
})

export class ToolbarMenuComponent {

  constructor (private toolbarService : MenuToolbarService) {}

  SidenavOpen : DxButtonTypes.Properties = {
    icon: 'menu',
    onClick : () => {
      this.toolbarService.ToggleMenuState();
    }
  };

  // Logout(){
  //   this.securityService.logoff().subscribe(rst => {
  //     this.router.navigate(['auth/login']);
  //   });
  // }
}
