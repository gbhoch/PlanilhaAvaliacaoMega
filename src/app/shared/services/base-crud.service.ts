import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';

/**
 * Generic REST CRUD base for resources served by the Express backend.
 * Subclasses declare `resource` (e.g. 'agrupadores') and expose
 * domain-named wrappers (getAgrupList, addSetor, ...) over these primitives.
 */
export abstract class BaseCrudService<T extends { id?: number }> {
  protected readonly http = inject(HttpClient);
  protected readonly api = inject(ApiService);

  protected abstract readonly resource: string;

  protected get url(): string {
    return `${this.api.baseUrl}/${this.resource}`;
  }

  list(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  add(item: T): Observable<T> {
    return this.http.post<T>(this.url, item);
  }

  update(item: T): Observable<T> {
    return this.http.put<T>(`${this.url}/${item.id}`, item);
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
