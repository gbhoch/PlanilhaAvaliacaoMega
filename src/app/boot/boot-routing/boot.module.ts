import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BootRoutingModule } from './boot-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BootComponent } from './boot.component';



@NgModule({
  declarations: [BootComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BootRoutingModule,
    HttpClientModule
  ],
  bootstrap: [BootComponent]
})
export class BootModule { }
