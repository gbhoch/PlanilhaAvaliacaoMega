import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public SetItem(key: string, value : object) : Observable<object>{
    window.localStorage.setItem(key, JSON.stringify(value));
    return of(value);
  }

  public GetItem(key : string) : Observable<object | null>{
    const value = window.localStorage.getItem(key);
    if(value == null || value == undefined ) return of();
    return of(JSON.parse(value));
  }

}
