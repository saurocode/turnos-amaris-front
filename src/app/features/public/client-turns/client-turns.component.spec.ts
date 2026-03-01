import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTurnsComponent } from './client-turns.component';

describe('ClientTurnsComponent', () => {
  let component: ClientTurnsComponent;
  let fixture: ComponentFixture<ClientTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTurnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
