import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../models/menu-item';
import { navigation } from '../models/navigation';
import { BehaviorSubject } from 'rxjs';
// import { LocalStorage } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class MenuToolbarService {

  private menuItems : MenuItem[] = navigation;

  public $menuState = new BehaviorSubject<boolean>(true);

  // @LocalStorage('menu-state')
  menuState : boolean = true;

  constructor(private router : Router){
    this.SetMenuState(this.menuState);
  }

  public ToggleMenuState(){
    this.SetMenuState(!this.$menuState.value);
  }

  public SetMenuState(state : boolean){
    this.menuState = state;
    this.$menuState.next(state);
  }

  public MenuItemClicked( item : MenuItem){
    this.router.navigate([item.path]);
  }
}
