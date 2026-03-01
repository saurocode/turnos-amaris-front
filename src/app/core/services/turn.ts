import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActualizarTurnoDto, CrearTurnoDto, TurnoResponse } from '../models/turn.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TurnoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/turn`;

  getAll(): Observable<TurnoResponse[]> {
    return this.http.get<TurnoResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<TurnoResponse> {
    return this.http.get<TurnoResponse>(`${this.apiUrl}/${id}`);
  }

  create(dto: CrearTurnoDto): Observable<TurnoResponse> {
    return this.http.post<TurnoResponse>(this.apiUrl, dto);
  }

  activate(id: number): Observable<TurnoResponse> {
    return this.http.put<TurnoResponse>(`${this.apiUrl}/${id}/activar`, {});
  }

  updateStatus(dto: ActualizarTurnoDto): Observable<TurnoResponse> {
    return this.http.put<TurnoResponse>(`${this.apiUrl}/estado`, dto);
  }
}