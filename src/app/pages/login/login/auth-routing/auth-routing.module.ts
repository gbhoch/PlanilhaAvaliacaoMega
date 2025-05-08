import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login.component';
import { HomeComponent } from '../../../home/home.component';

const routes : Routes = [
  // {
  // path : '',
  // redirectTo : 'login',
  // pathMatch : "full"
  // },
  {

    path : 'login',
    component : LoginComponent
  },
  {
    path : 'planilha',
    component : HomeComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports : [RouterModule]
})
export class AuthRoutingModule { }
