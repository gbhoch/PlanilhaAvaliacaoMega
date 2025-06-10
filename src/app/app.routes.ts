import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login/login.component';
import { AppComponent } from './app.component';
import { AgrupadoresComponent } from './pages/agrupadores/agrupadores.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path:'',
    component: LayoutComponent,
    children:[
    {
      path : 'agrupadores',
      component : AgrupadoresComponent,  //Tela de Cadastro dos Itens e Agrupadores
    },
    {
      path : 'planilha',
      component : HomeComponent, //Tela da Planilha com Agrupadores e Itens
    }]
  },

];
