import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when token exists', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false when token does not exist', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear storage on logout', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('username', 'admin');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });

  it('should return username from localStorage', () => {
    localStorage.setItem('username', 'admin');
    expect(service.getUsername()).toBe('admin');
  });
});