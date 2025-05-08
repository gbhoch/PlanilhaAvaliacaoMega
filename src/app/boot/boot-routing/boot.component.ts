import { provideRouter, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from '@angular/router';

@Component({
  selector : 'root-boot',
  template : `
  <!-- <router-outlet></router-outlet> -->
  `,
  providers:[RouterOutlet]
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
