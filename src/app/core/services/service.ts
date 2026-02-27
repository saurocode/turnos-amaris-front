import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/service`;

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }
}