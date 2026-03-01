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
    this.cargarDatos();
    this.intervalo = setInterval(() => this.cargarTurnos(), 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  cargarDatos(): void {
    this.http.get<ApiResponse<Location[]>>(`${this.apiUrl}/locations`)
      .pipe(map(r => r.data)).subscribe(data => this.locations = data);
    this.http.get<ApiResponse<Service[]>>(`${this.apiUrl}/services`)
      .pipe(map(r => r.data)).subscribe(data => this.services = data);
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.loading = true;
    this.http.get<ApiResponse<TurnResponse[]>>(`${this.apiUrl}/turns/${this.cedula}`)
      .pipe(map(r => r.data)).subscribe({
        next: (data) => { this.turnos = data; this.loading = false; },
        error: () => { this.errorMessage = 'Error al cargar turnos'; this.loading = false; }
      });
  }

  agendarTurno(): void {
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
          this.successMessage = `✅ Turno ${turno.turnCode} agendado. Tienes 15 minutos para llegar.`;
          this.loadingForm = false;
          this.mostrarFormulario = false;
          this.form.reset();
          this.cargarTurnos();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al agendar turno';
          this.loadingForm = false;
        }
      });
  }

  activarTurno(id: number): void {
    this.http.put<ApiResponse<TurnResponse>>(`${this.apiUrl}/turns/${id}/activate`, {})
      .pipe(map(r => r.data)).subscribe({
        next: (turno) => {
          this.successMessage = `Turno ${turno.turnCode} activado correctamente`;
          this.cargarTurnos();
        },
        error: (err) => { this.errorMessage = err.error?.message || 'Error al activar'; }
      });
  }

  abrirModalCancelar(turno: TurnResponse): void { this.turnoAancelar = turno; }
  cerrarModalCancelar(): void { this.turnoAancelar = null; }

  confirmarCancelacion(): void {
    if (!this.turnoAancelar) return;
    this.http.put<ApiResponse<TurnResponse>>(`${this.apiUrl}/turns/status`,
      { id: this.turnoAancelar.id, newStatus: 'Cancelado' })
      .pipe(map(r => r.data)).subscribe({
        next: () => {
          this.successMessage = 'Turno cancelado';
          this.cerrarModalCancelar();
          this.cargarTurnos();
        },
        error: (err) => { this.errorMessage = err.error?.message || 'Error al cancelar'; }
      });
  }

  getBadgeClass(status: string): string {
    const c: Record<string, string> = {
      'Pendiente': 'bg-warning text-dark', 'Activo': 'bg-success',
      'Completado': 'bg-primary', 'Expirado': 'bg-danger', 'Cancelado': 'bg-secondary'
    };
    return c[status] ?? 'bg-secondary';
  }

  getIconEstado(status: string): string {
    const i: Record<string, string> = {
      'Pendiente': 'bi-clock', 'Activo': 'bi-check-circle',
      'Completado': 'bi-check-all', 'Expirado': 'bi-x-circle', 'Cancelado': 'bi-slash-circle'
    };
    return i[status] ?? 'bi-circle';
  }

  volver(): void { this.router.navigate(['/']); }
}