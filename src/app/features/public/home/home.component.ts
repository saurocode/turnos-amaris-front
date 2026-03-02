import { Component, inject  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    cedula: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]+$')]]
  });

  ingresarComoCliente(): void {
    if (this.form.invalid) return;
    this.router.navigate(['/cliente', this.form.value.cedula]);
  }
}