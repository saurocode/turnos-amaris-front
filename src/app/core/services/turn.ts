import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateTurnDto, CreateTurnDto, TurnResponse, TurnFilterDto } from '../models/turn.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TurnoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/turn`;

  getAll(): Observable<TurnResponse[]> {
    return this.http.get<TurnResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<TurnResponse> {
    return this.http.get<TurnResponse>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTurnDto): Observable<TurnResponse> {
    return this.http.post<TurnResponse>(this.apiUrl, dto);
  }

  activate(id: number): Observable<TurnResponse> {
    return this.http.put<TurnResponse>(`${this.apiUrl}/${id}/activar`, {});
  }

  updateStatus(dto: UpdateTurnDto): Observable<TurnResponse> {
    return this.http.put<TurnResponse>(`${this.apiUrl}/estado`, dto);
  }

  getFiltered(filter: TurnFilterDto): Observable<TurnResponse[]> {
    let params = new HttpParams();
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<TurnResponse[]>>(`${this.apiUrl}/filtered`, { params })
      .pipe(map(r => r.data));
  }

  private cleanParams(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    );
  }

    actualizarEstado(dto: UpdateTurnDto): Observable<any> {
    return this.http.patch(`/api/turnos/${dto.id}/estado`, { newStatus: dto.newStatus });
  }

}