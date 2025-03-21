import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemVerifComponent } from './add-item-verif.component';

describe('AddItemVerifComponent', () => {
  let component: AddItemVerifComponent;
  let fixture: ComponentFixture<AddItemVerifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemVerifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddItemVerifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
