import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { DxButtonModule, DxNumberBoxModule, DxTextBoxModule } from 'devextreme-angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    DxButtonModule,
    DxTextBoxModule,
    DxNumberBoxModule
  ]
})
export class AuthModule { }
