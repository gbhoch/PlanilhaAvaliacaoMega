import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login/login.component';
import { AuthRoutingModule } from './pages/login/login/auth-routing/auth-routing.module';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LoginComponent,
    AuthRoutingModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
