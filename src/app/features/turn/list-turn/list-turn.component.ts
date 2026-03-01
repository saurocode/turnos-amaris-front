import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TurnoService } from '../../../core/services/turn';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { TurnResponse } from '../../../core/models/turn.model';

@Component({
  selector: 'app-list-turn',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './list-turn.component.html',
  styleUrl: './list-turn.component.css'
})
export class ListTurnComponent implements OnInit, OnDestroy {
  private turnoService = inject(TurnoService);

  turnos: TurnResponse[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  turnToCancel: TurnResponse | null = null;
  private interval: any;

  ngOnInit(): void {
    this.loadTurns();
    this.interval = setInterval(() => this.loadTurns(), 30000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  loadTurns(): void {
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

  activateTurn(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.turnoService.activate(id).subscribe({
      next: (turno) => {
        this.successMessage = `Turno ${turno.turnCode} activado correctamente`;
        this.loadTurns();
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

  getStateIcon(estado: string): string {
    const iconos: Record<string, string> = {
      'Pendiente': 'bi-clock',
      'Activo': 'bi-check-circle',
      'Completado': 'bi-check-all',
      'Expirado': 'bi-x-circle',
      'Cancelado': 'bi-slash-circle'
    };
    return iconos[estado] ?? 'bi-circle';
  }

  cancelTurn(id: number): void {
    if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.turnoService.updateStatus({ id, newStatus: 'Cancelado' }).subscribe({
      next: () => {
        this.successMessage = 'Turno cancelado correctamente';
        this.loadTurns();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al cancelar el turno';
      }
    });
  }

  confirmCancellation(): void {
    if (!this.turnToCancel) return;
    this.errorMessage = '';
    this.successMessage = '';

    this.turnoService.updateStatus({ id: this.turnToCancel.id, newStatus: 'Cancelado' }).subscribe({
      next: () => {
        this.successMessage = `Turno ${this.turnToCancel?.turnCode} cancelado correctamente`;
        this.closeCancelModal();
        this.loadTurns();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al cancelar el turno';
        this.closeCancelModal();
      }
    });
  }

  openCancelModal(turno: TurnResponse): void {
    this.turnToCancel = turno;
  }

  closeCancelModal(): void {
    this.turnToCancel = null;
  }
}