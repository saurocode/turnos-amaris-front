import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurnResponse } from '../../../core/models/turn.model';
import { Location } from '../../../core/models/location.model';
import { Service } from '../../../core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-client-turns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-turns.component.html',
  styleUrl: './client-turns.component.css'
})
export class ClientTurnsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/public`;

  cedula = '';
  turnos: TurnResponse[] = [];
  locations: Location[] = [];
  services: Service[] = [];
  loading = false;
  loadingForm = false;
  errorMessage = '';
  successMessage = '';
  mostrarFormulario = false;
  turnoAancelar: TurnResponse | null = null;
  private intervalo: any;

  form: FormGroup = this.fb.group({
    idLocation: ['', Validators.required],
    serviceId: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cedula = this.route.snapshot.paramMap.get('cedula') ?? '';
    if (!this.cedula) { this.router.navigate(['/']); return; }
    this.loadData();
    this.intervalo = setInterval(() => this.loadTurns(), 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  loadData(): void {
    this.http.get<ApiResponse<Location[]>>(`${this.apiUrl}/locations`)
      .pipe(map(r => r.data)).subscribe(data => this.locations = data);
    this.http.get<ApiResponse<Service[]>>(`${this.apiUrl}/services`)
      .pipe(map(r => r.data)).subscribe(data => this.services = data);
    this.loadTurns();
  }

  loadTurns(): void {
    this.loading = true;
    this.http.get<ApiResponse<TurnResponse[]>>(`${this.apiUrl}/turns/${this.cedula}`)
      .pipe(map(r => r.data)).subscribe({
        next: (data) => { this.turnos = data; this.loading = false; },
        error: (err) => {
          this.errorMessage = this.getErrorMessage(err);
          this.loading = false;
        }
      });
  }

  scheduleTurn(): void {
    if (this.form.invalid) return;
    this.loadingForm = true;
    this.errorMessage = '';
    const dto = {
      identification: this.cedula,
      idLocation: +this.form.value.idLocation,
      serviceId: +this.form.value.serviceId
    };
    this.http.post<ApiResponse<TurnResponse>>(`${this.apiUrl}/turns`, dto)
      .pipe(map(r => r.data)).subscribe({
        next: (turno) => {
          this.successMessage = `Turno ${turno.turnCode} agendado. Tienes 15 minutos para llegar.`;
          this.loadingForm = false;
          this.mostrarFormulario = false;
          this.form.reset();
          this.loadTurns();
        },
        error: (err) => {
          this.errorMessage = this.getErrorMessage(err);
          this.loadingForm = false;
        }
      });
  }

  activateTurn(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.put<ApiResponse<TurnResponse>>(`${this.apiUrl}/turns/${id}/activate`, {})
      .pipe(map(r => r.data)).subscribe({
        next: (turno) => {
          this.successMessage = `Turno ${turno.turnCode} activado correctamente`;
          this.loadTurns();
        },
        error: (err) => { this.errorMessage = this.getErrorMessage(err); }
      });
  }

  openCancelModal(turno: TurnResponse): void { this.turnoAancelar = turno; }
  closeCancelModal(): void { this.turnoAancelar = null; }

  confirmCancellation(): void {
    if (!this.turnoAancelar) return;
    this.http.put<ApiResponse<TurnResponse>>(`${this.apiUrl}/turns/status`,
      { id: this.turnoAancelar.id, newStatus: 'Cancelado' })
      .pipe(map(r => r.data)).subscribe({
        next: () => {
          this.successMessage = 'Turno cancelado correctamente';
          this.closeCancelModal();
          this.loadTurns();
        },
        error: (err) => {
          this.errorMessage = this.getErrorMessage(err);
          this.closeCancelModal();
        }
      });
  }

  getBadgeClass(status: string): string {
    const c: Record<string, string> = {
      'Pendiente': 'bg-warning text-dark', 'Activo': 'bg-success',
      'Completado': 'bg-primary', 'Expirado': 'bg-danger', 'Cancelado': 'bg-secondary'
    };
    return c[status] ?? 'bg-secondary';
  }

  getStatusIcon(status: string): string {
    const i: Record<string, string> = {
      'Pendiente': 'bi-clock', 'Activo': 'bi-check-circle',
      'Completado': 'bi-check-all', 'Expirado': 'bi-x-circle', 'Cancelado': 'bi-slash-circle'
    };
    return i[status] ?? 'bi-circle';
  }

  goBack(): void { this.router.navigate(['/']); }

  private getErrorMessage(err: any): string {
  return err.error?.message || err.error?.error || err.message || 'Error inesperado';
}
}