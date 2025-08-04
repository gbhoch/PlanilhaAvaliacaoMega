import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  DxToolbarModule,
  DxButtonModule,
  DxMenuModule,
  DxPopoverModule,
} from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { MenuToolbarService } from '../../services';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-toolbar-menu',
  standalone: true,
  imports: [
    DxToolbarModule,
    DxButtonModule,
    NgIf,
    DxMenuModule,
    DxPopoverModule,
  ],
  templateUrl: './toolbar-menu.component.html',
  styleUrl: './toolbar-menu.component.scss',
})
export class ToolbarMenuComponent {
  mostrarPopover = false;
  nomeUsuario = 'Gabriel Hochscheidt';

  constructor(
    private toolbarService: MenuToolbarService,
    private router : Router
  ) {}

  @ViewChild('botaoUsuario', { static: false }) botaoUsuario: ElementRef | undefined;

  SidenavOpen: DxButtonTypes.Properties = {
    icon: 'menu',
    onClick: () => {
      this.toolbarService.ToggleMenuState();
    },
  };

  logout() {
    this.mostrarPopover = false;
    this.router.navigate(['/login']);
  }

  // onUsuarioMenuClick(e: any) {
  //   if (e.itemData?.action === 'logout') {
  //     const confirmado = confirm('Deseja realmente sair?');
  //     if (confirmado) {
  //       // this.securityService.logoff().subscribe(() => this.router.navigate(['auth/login']));
  //       console.log('Logout confirmado');
  //     }
  //   }
  // }
}
