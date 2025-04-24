import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddItemVerifComponent } from './pages/add-item-verif/add-item-verif.component';
import { LoginComponent } from './pages/login/login/login.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LoginComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
