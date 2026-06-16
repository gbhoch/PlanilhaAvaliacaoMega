import { navigation } from './../../models/navigation';
import { Component, OnInit, inject } from '@angular/core';
import { DxDrawerModule, DxListModule } from 'devextreme-angular';
import { MenuToolbarService } from '../../services';
import { MenuItem } from '../../models/menu-item';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DxDrawerModule, DxListModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  public menuItems : MenuItem[] = navigation;
  public menuState : boolean = true;

  public menuService = inject(MenuToolbarService);

  ngOnInit(): void {
    this.menuService.$menuState.subscribe((state : boolean) => {
      this.menuState = state;
    })
  }

  router: any;

  menuItemCLick(evt : any){
    this.menuService.MenuItemClicked(evt.itemData);
  }
}
