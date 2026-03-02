import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateTurnComponent } from './create-turn.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('CreateTurnComponent', () => {
  let component: CreateTurnComponent;
  let fixture: ComponentFixture<CreateTurnComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTurnComponent, HttpClientTestingModule],
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

    fixture = TestBed.createComponent(CreateTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
