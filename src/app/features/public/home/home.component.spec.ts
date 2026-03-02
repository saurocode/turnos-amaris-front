import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should have valid form with correct cedula', () => {
    component.form.setValue({ cedula: '1234567890' });
    expect(component.form.valid).toBeTruthy();
  });

  it('should reject cedula with letters', () => {
    component.form.setValue({ cedula: 'abc123' });
    expect(component.form.get('cedula')?.errors?.['pattern']).toBeTruthy();
  });

  it('should reject cedula with less than 6 digits', () => {
    component.form.setValue({ cedula: '123' });
    expect(component.form.get('cedula')?.errors?.['minlength']).toBeTruthy();
  });

  it('should navigate to cliente route on submit', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.form.setValue({ cedula: '1234567890' });
    component.ingresarComoCliente();
    expect(navigateSpy).toHaveBeenCalledWith(['/cliente', '1234567890']);
  });

  it('should not navigate if form is invalid', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.form.setValue({ cedula: '' });
    component.ingresarComoCliente();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});