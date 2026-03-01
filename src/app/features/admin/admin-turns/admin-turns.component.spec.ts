import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTurnsComponent } from './admin-turns.component';

describe('AdminTurnsComponent', () => {
  let component: AdminTurnsComponent;
  let fixture: ComponentFixture<AdminTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTurnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
