import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TurnoService } from '../../../core/services/turn';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { TurnoResponse } from '../../../core/models/turn.model';

@Component({
  selector: 'app-list-turn',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './list-turn.component.html',
  styleUrl: './list-turn.component.css'
})
export class ListTurnComponent implements OnInit, OnDestroy {
  private turnoService = inject(TurnoService);

  turnos: TurnoResponse[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  turnoAancelar: TurnoResponse | null = null;
  private intervalo: any;

  ngOnInit(): void {
    this.cargarTurnos();
    this.intervalo = setInterval(() => this.cargarTurnos(), 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  cargarTurnos(): void {
    this.loading = true;
    this.turnoService.getAll().subscribe({
      next: (data) => {
        this.turnos = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los turnos';
        this.loading = false;
      }
    });
  }

  activarTurno(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.turnoService.activar(id).subscribe({
      next: (turno) => {
        this.successMessage = `Turno ${turno.turnCode} activado correctamente`;
        this.cargarTurnos();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al activar el turno';
      }
    });
  }

  getBadgeClass(estado: string): string {
    const clases: Record<string, string> = {
      'Pendiente': 'bg-warning text-dark',
      'Activo': 'bg-success',
      'Completado': 'bg-primary',
      'Expirado': 'bg-danger',
      'Cancelado': 'bg-secondary'
    };
    return clases[estado] ?? 'bg-secondary';
  }

  getIconEstado(estado: string): string {
    const iconos: Record<string, string> = {
      'Pendiente': 'bi-clock',
      'Activo': 'bi-check-circle',
      'Completado': 'bi-check-all',
      'Expirado': 'bi-x-circle',
      'Cancelado': 'bi-slash-circle'
    };
    return iconos[estado] ?? 'bi-circle';
  }

  cancelarTurno(id: number): void {
    if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.turnoService.actualizarEstado({ id, newStatus: 'Cancelado' }).subscribe({
      next: () => {
        this.successMessage = 'Turno cancelado correctamente';
        this.cargarTurnos();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al cancelar el turno';
      }
    });
  }

  confirmarCancelacion(): void {
    if (!this.turnoAancelar) return;
    this.errorMessage = '';
    this.successMessage = '';

    this.turnoService.actualizarEstado({ id: this.turnoAancelar.id, newStatus: 'Cancelado' }).subscribe({
      next: () => {
        this.successMessage = `Turno ${this.turnoAancelar?.turnCode} cancelado correctamente`;
        this.cerrarModalCancelar();
        this.cargarTurnos();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al cancelar el turno';
        this.cerrarModalCancelar();
      }
    });
  }

  abrirModalCancelar(turno: TurnoResponse): void {
    this.turnoAancelar = turno;
  }

  cerrarModalCancelar(): void {
    this.turnoAancelar = null;
  }
}