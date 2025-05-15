import { MenuComponent } from '../pages/menu/menu.component';
import { ToolbarMenuComponent } from './../pages/menu/toolbar/toolbar-menu/toolbar-menu.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuToolbarService {

  constructor() { }

  public openSidenav(sideNav: ToolbarMenuComponent){
    console.log('click')
  }
}
