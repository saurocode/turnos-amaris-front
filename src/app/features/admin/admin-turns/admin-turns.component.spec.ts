import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AdminTurnsComponent } from './admin-turns.component';

describe('AdminTurnsComponent', () => {
  let component: AdminTurnsComponent;
  let fixture: ComponentFixture<AdminTurnsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTurnsComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ status: 'Pendiente' })),
            paramMap: of(convertToParamMap({ id: '123' })),
            snapshot: {
              paramMap: convertToParamMap({ id: '123' }),
              queryParamMap: convertToParamMap({ status: 'Pendiente' })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
