import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector : 'app-boot',
  template : `
  <router-outlet></router-outlet>
  `
})

export class BootComponent implements OnInit{

  constructor (
    private AuthService : AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
      let rotaInicial = '';
      if(!this.AuthService.isLogged())
        rotaInicial = 'auth'

      this.router.navigate([rotaInicial]);
  }
}
