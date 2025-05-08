import { Routes } from '@angular/router';
import { BootComponent } from './boot/boot-routing/boot.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login/login.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AddItemVerifComponent } from './pages/add-item-verif/add-item-verif.component';

export const routes: Routes = [
  {
    path:'',
    component:AppComponent,
    children:[
    {
      path: '',
      pathMatch : 'full',
      redirectTo : 'login'
    },
    {
      path : 'login',
      component : LoginComponent
    },
    {
      path : 'planilha',
      component : HomeComponent
    },
    {
      path : 'menu',
      component : MenuComponent
    }]
  },

];

export const routesSideNav: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'planilha', component: AddItemVerifComponent },
  { path: 'menu', component: HomeComponent },
  { path: 'login', component: LoginComponent },
];
