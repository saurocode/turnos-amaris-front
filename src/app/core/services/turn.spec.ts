import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurnoService } from './turn';
import { TurnResponse } from '../models/turn.model';

describe('TurnoService', () => {
  let service: TurnoService;
  let httpMock: HttpTestingController;

  const mockTurno: TurnResponse = {
    id: 30,
    turnCode: 'T-20260301-ABC001',
    identification: '1234567890',
    idLocation: 1,
    locationName: 'Sucursal Centro',
    serviceId: 1,
    serviceName: 'Ventanilla / Caja',
    dateCreation: new Date().toISOString(),
    dateExpiration: new Date(Date.now() + 15 * 60000).toISOString(),
    status: 'Pendiente',
    minutesRemaining: 14
  };

  const mockApiResponse = (data: any) => ({
    success: true,
    message: 'OK',
    data,
    statusCode: 200
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TurnoService]
    });
    service = TestBed.inject(TurnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should get filtered turns', () => {
  const filterDto = { status: 'Pendiente' };
  service.getFiltered(filterDto).subscribe(res => {
    expect(res).toEqual([mockTurno]);
  });

  const req = httpMock.expectOne((r) =>
    r.method === 'GET' &&
    r.url.endsWith('/api/turn/filtered') &&
    r.params.get('status') === 'Pendiente'
  );

  req.flush(mockApiResponse([mockTurno]));
});

});