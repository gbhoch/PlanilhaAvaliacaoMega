
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {
    path : 'auth',
    loadChildren: () => import('../../pages/login/login/auth-routing/auth.module').then(m => m.AuthModule)
  },
  {
    path : '',
    loadChildren: () => import('../../pages/home/home.component').then(m => m.HomeComponent)
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class BootRoutingModule { }
