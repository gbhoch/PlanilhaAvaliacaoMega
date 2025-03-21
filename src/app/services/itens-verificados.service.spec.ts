import { TestBed } from '@angular/core/testing';

import { ItensVerificadosService } from './itens-verificados.service';

describe('ItensVerificadosService', () => {
  let service: ItensVerificadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItensVerificadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
