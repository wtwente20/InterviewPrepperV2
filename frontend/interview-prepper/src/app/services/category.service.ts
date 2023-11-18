import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
