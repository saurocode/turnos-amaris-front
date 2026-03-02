import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should have valid form with correct credentials', () => {
    component.form.setValue({ username: 'admin', password: 'admin123*' });
    expect(component.form.valid).toBeTruthy();
  });

  it('should navigate to admin on successful login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    authService.login.and.returnValue(of({
      token: 'fake-token',
      username: 'admin',
      expiracion: new Date().toISOString()
    }));

    component.form.setValue({ username: 'admin', password: 'admin123*' });
    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
  });

  it('should show error message on failed login', () => {
    authService.login.and.returnValue(
      throwError(() => ({ error: { message: 'Credenciales inválidas' } }))
    );

    component.form.setValue({ username: 'admin', password: 'admin123*' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales inválidas');
    expect(component.loading).toBeFalse();
  });

  it('should set loading true while submitting', () => {
    authService.login.and.returnValue(of({
      token: 'fake-token',
      username: 'admin',
      expiracion: new Date().toISOString()
    }));

    component.form.setValue({ username: 'admin', password: 'admin123*' });
    component.onSubmit();

    expect(component.loading).toBeTruthy();
  });

});