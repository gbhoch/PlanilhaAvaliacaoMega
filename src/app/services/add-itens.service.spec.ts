import { TestBed } from '@angular/core/testing';

import { AddItensService } from './add-itens.service';

describe('AddItensService', () => {
  let service: AddItensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddItensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
