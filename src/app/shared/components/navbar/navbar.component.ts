import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() showClientLinks = true;
  private authService = inject(AuthService);
  private router = inject(Router);

  get username(): string | null {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
  }
}