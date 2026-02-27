import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../../core/services/turn';
import { LocationService } from '../../../core/services/location';
import { Location } from '../../../core/models/location.model';
import { NavbarComponent  } from "../../../shared/components/navbar/navbar.component";
import { ServiceService } from '../../../core/services/service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-create-turn',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent ],
  templateUrl: './create-turn.component.html',
  styleUrl: './create-turn.component.css'
})
export class CreateTurnComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turnoService = inject(TurnoService);
  private locationService = inject(LocationService);
  private router = inject(Router);
  private serviceService = inject(ServiceService);


  form: FormGroup = this.fb.group({
    identification: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]],
    idLocation: ['', Validators.required],
    serviceId: ['', Validators.required]   
  });

  services: Service[] = [];
  locations: Location[] = [];
  loading = false;
  loadingLocations = true;
  loadingServices = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.cargarServicios();
    this.locationService.getAll().subscribe({
      next: (data) => {
        this.locations = data;
        this.loadingLocations = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar las sucursales';
        this.loadingLocations = false;
      }
    });
  }

  cargarServicios(): void {
  this.loadingServices = true;
  this.serviceService.getAll().subscribe({
    next: (data) => { this.services = data; this.loadingServices = false; },
    error: () => { this.errorMessage = 'Error al cargar los servicios'; this.loadingServices = false; }
  });
}

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.turnoService.crear(this.form.value).subscribe({
      next: (turno) => {
        this.successMessage = `Turno creado: ${turno.turnCode}. Tienes ${turno.minutesRemaining} minutos para llegar a la sucursal.`;
        this.loading = false;
        this.form.reset();
        setTimeout(() => this.router.navigate(['/turnos']), 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al crear el turno';
        this.loading = false;
      }
    });
  }
}