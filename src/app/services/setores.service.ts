import { SetorInterface } from './../models/interfaces/setores.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SetoresService {
  private storageKey = "SETORES";
  private setoresSubject = new BehaviorSubject<SetorInterface[]>([]);
  setores$ = this.setoresSubject.asObservable();

  constructor(
    private storage : StorageService
  ){}

  getSetores(): Observable<SetorInterface[]> {
    let memoryValue = this.setoresSubject.getValue();
    if(memoryValue.length == 0 || memoryValue == null || memoryValue == undefined){
      this.storage.GetItem(this.storageKey).subscribe((rst : any) => {
        if(rst != null) this.setoresSubject.next(rst);
      });
    }
    return this.setores$;
  }

  addSetor(setor: SetorInterface) {
    const setores = this.setoresSubject.getValue();
    const novoId =
      setores.length > 0 ? Math.max(...setores.map((s) => s.id)) + 1 : 1;
    const setorComId = { ...setor, id: novoId };

    return this.storage.SetItem(this.storageKey, [...setores, setorComId])
    .pipe(map((rst => {
      this.setoresSubject.next(rst);
      return rst
    })));
  }

  updateSetor(setor: SetorInterface) {
    const setores = this.setoresSubject.getValue();
    const index = setores.findIndex((s) => s.id === setor.id);
    if (index !== -1) {
      const novaLista = [...setores];
      novaLista[index] = { ...setor };
      this.storage.SetItem(this.storageKey, novaLista).subscribe((rst : any) => {
        this.setoresSubject.next(rst);
      });
    }
  }

  removerSetor(setor : SetorInterface){
    const setores = this.setoresSubject.getValue();
    const novaLista = setores.filter(s => s.id !== setor.id);

    this.storage.SetItem(this.storageKey, novaLista).subscribe((rst : any) => {
      this.setoresSubject.next(rst);
    });
  }
}
