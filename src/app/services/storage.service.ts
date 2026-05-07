import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public SetItem<T>(key: string, value : T) : Observable<T>{
    window.localStorage.setItem(key, JSON.stringify(value));
    return of(value);
  }

  public GetItem(key : string) : Observable<object | null>{
    const value = window.localStorage.getItem(key);
    if(value == null || value == undefined ) return of();
    return of(JSON.parse(value));
  }

}
