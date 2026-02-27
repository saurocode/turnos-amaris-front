export interface Turno {
}

export interface CrearTurnoDto {
  identification: string;
  idLocation: number;
}

export interface ActualizarTurnoDto {
  id: number;
  newStatus: string;
}

export interface TurnoResponse {
  id: number;
  turnCode: string;
  identification: string;
  idLocation: number;
  locationName: string;
  dateCreation: string;
  dateExpiration: string;
  dateActivation?: string;
  status: string;
  minutesRemaining: number;
}
