import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SetorInterface } from '../models/interfaces/setores.interface';
import { BaseCrudService } from '../shared/services/base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class SetoresService extends BaseCrudService<SetorInterface> {
  protected readonly resource = 'setores';

  getSetores(): Observable<SetorInterface[]> {
    return this.list();
  }

  addSetor(setor: SetorInterface): Observable<SetorInterface> {
    return this.add(setor);
  }

  updateSetor(setor: SetorInterface): Observable<SetorInterface> {
    return this.update(setor);
  }

  removerSetor(setor: SetorInterface): Observable<unknown> {
    return this.remove(setor.id);
  }

  getSetorComPlano(id: number): Observable<SetorInterface> {
    return this.http.get<SetorInterface>(`${this.url}/${id}/plano`);
  }

  salvarPlano(setorId: number, planoDeAvaliacao: any[]): Observable<SetorInterface> {
    return this.http.put<SetorInterface>(
      `${this.url}/${setorId}/plano`,
      { planoDeAvaliacao }
    );
  }
}
