import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ListTurnComponent } from './list-turn.component';

describe('ListTurnComponent', () => {
  let component: ListTurnComponent;
  let fixture: ComponentFixture<ListTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTurnComponent, HttpClientTestingModule],
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

    fixture = TestBed.createComponent(ListTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
