import { CommonModule, NgIf } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-add-item-verif',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './add-item-verif.component.html',
  styleUrl: './add-item-verif.component.css'
})
export class AddItemVerifComponent {
  @Output() openModal: EventEmitter<any> = new EventEmitter()

  toggle() {
    this.openModal.emit();
  }
}
