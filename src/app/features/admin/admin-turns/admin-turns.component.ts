import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TurnoService } from '../../../core/services/turn';
import { LocationService } from '../../../core/services/location';
import { ServiceService } from '../../../core/services/service';
import { AuthService } from '../../../core/services/auth';
import { TurnResponse, TurnFilterDto, UpdateTurnDto } from '../../../core/models/turn.model';
import { Location } from '../../../core/models/location.model';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-admin-turns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-turns.component.html',
  styleUrl: './admin-turns.component.css'
})
export class AdminTurnsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turnoService = inject(TurnoService);
  private sucursalService = inject(LocationService);
  private serviceService = inject(ServiceService);
  private authService = inject(AuthService);
  private router = inject(Router);

  turnos: TurnResponse[] = [];
  sucursales: Location[] = [];
  services: Service[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  turnoAancelar: TurnResponse | null = null;

  readonly statuses = ['Pendiente', 'Activo', 'Completado', 'Expirado', 'Cancelado'];

  filterForm: FormGroup = this.fb.group({
    identification: [''],
    status: [''],
    locationId: [''],
    serviceId: [''],
    dateFrom: [''],
    dateTo: ['']
  });

  // Stats
  get totalTurnos() { return this.turnos.length; }
  get turnosPendientes() { return this.turnos.filter(t => t.status === 'Pendiente').length; }
  get turnosActivos() { return this.turnos.filter(t => t.status === 'Activo').length; }
  get turnosExpirados() { return this.turnos.filter(t => t.status === 'Expirado').length; }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.buscar();
  }

  cargarCatalogos(): void {
    this.sucursalService.getAll().subscribe(data => this.sucursales = data);
    this.serviceService.getAll().subscribe(data => this.services = data);
  }

  buscar(): void {
    this.loading = true;
    this.errorMessage = '';
    const filter: TurnFilterDto = this.filterForm.value;

    this.turnoService.getFiltered(filter).subscribe({
      next: (data) => { this.turnos = data; this.loading = false; },
      error: () => { this.errorMessage = 'Error al cargar turnos'; this.loading = false; }
    });
  }

  limpiarFiltros(): void {
    this.filterForm.reset();
    this.buscar();
  }

  cambiarEstado(turno: TurnResponse, nuevoEstado: string): void {
    this.errorMessage = '';
    this.successMessage = '';
    const dto: UpdateTurnDto = { id: turno.id, newStatus: nuevoEstado };

    this.turnoService.updateStatus(dto).subscribe({
      next: () => {
        this.successMessage = `Turno ${turno.turnCode} → ${nuevoEstado}`;
        this.buscar();
      },
      error: (err) => { this.errorMessage = err.error?.message || 'Error al cambiar estado'; }
    });
  }

  abrirModalCancelar(turno: TurnResponse): void { this.turnoAancelar = turno; }
  cerrarModalCancelar(): void { this.turnoAancelar = null; }

  confirmarCancelacion(): void {
    if (!this.turnoAancelar) return;
    this.cambiarEstado(this.turnoAancelar, 'Cancelado');
    this.cerrarModalCancelar();
  }

  getBadgeClass(status: string): string {
    const c: Record<string, string> = {
      'Pendiente': 'bg-warning text-dark', 'Activo': 'bg-success',
      'Completado': 'bg-primary', 'Expirado': 'bg-danger', 'Cancelado': 'bg-secondary'
    };
    return c[status] ?? 'bg-secondary';
  }

  logout(): void { this.authService.logout(); }

  get username(): string | null {
  return this.authService.getUsername();
}
}