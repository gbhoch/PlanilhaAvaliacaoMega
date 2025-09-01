import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SetorInterface } from '../models/interfaces/setores.interface';

@Injectable({
  providedIn: 'root',
})
export class SetoresService {
  private setoresSubject = new BehaviorSubject<SetorInterface[]>([]);
  setores$ = this.setoresSubject.asObservable();

  getSetores(): Observable<SetorInterface[]> {
    return this.setores$;
  }

  addSetor(setor: SetorInterface) {
    const setores = this.setoresSubject.getValue();
    const novoId =
      setores.length > 0 ? Math.max(...setores.map((s) => s.id)) + 1 : 1;
    const setorComId = { ...setor, id: novoId };
    this.setoresSubject.next([...setores, setorComId]);
  }

  updateSetor(setor: SetorInterface) {
    const setores = this.setoresSubject.getValue();
    const index = setores.findIndex((s) => s.id === setor.id);
    if (index !== -1) {
      setores[index] = { ...setor };
      this.setoresSubject.next([...setores]);
    }
  }
}
