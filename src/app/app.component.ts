import { Component } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { ItensVerificadosService } from './services/itens-verificados.service';
import { AddItemVerifComponent } from "./pages/add-item-verif/add-item-verif.component";
import { LoginComponent } from './pages/login/login/login.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HomeComponent, AddItemVerifComponent, LoginComponent],
  providers: []
})
export class AppComponent {
  title = 'ProjetoANGULAR';
}
