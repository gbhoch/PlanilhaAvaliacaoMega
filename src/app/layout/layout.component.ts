import { Component } from '@angular/core';
import { MenuComponent } from "./menu/menu.component";
import { RouterOutlet } from '@angular/router';
import { ToolbarMenuComponent } from "./toolbar-menu/toolbar-menu.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-toolbar-menu></app-toolbar-menu>
    <app-menu>
      <router-outlet></router-outlet>
    </app-menu>
  `,
  imports: [MenuComponent, RouterOutlet, ToolbarMenuComponent]
})
export class LayoutComponent {

}
