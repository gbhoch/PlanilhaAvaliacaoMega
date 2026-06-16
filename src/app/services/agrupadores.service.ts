import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SensoInterface } from '../models/interfaces/senso.interface';
import { BaseCrudService } from '../shared/services/base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AgrupadoresService extends BaseCrudService<SensoInterface> {
  protected readonly resource = 'agrupadores';

  getAgrupList(): Observable<SensoInterface[]> {
    return this.list();
  }

  addAgrupador(agrupador: SensoInterface): Observable<SensoInterface> {
    return this.add(agrupador);
  }

  updateAgrupador(agrupador: SensoInterface): Observable<SensoInterface> {
    return this.update(agrupador);
  }

  removerAgrupador(id: number): Observable<unknown> {
    return this.remove(id);
  }

  verificarUsoItem(itemId: number): Observable<{ emUso: boolean }> {
    return this.http.get<{ emUso: boolean }>(`${this.url}/itens/${itemId}/uso`);
  }
}
