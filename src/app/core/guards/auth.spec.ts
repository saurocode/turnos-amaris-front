import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth';
import { AuthService } from '../services/auth';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should allow access when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(true);
  });

  it('should redirect to admin login when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');

    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});