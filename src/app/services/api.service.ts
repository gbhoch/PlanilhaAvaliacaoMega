import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL base da API - aponta para o backend Express
  readonly baseUrl = 'http://localhost:3000'
}
