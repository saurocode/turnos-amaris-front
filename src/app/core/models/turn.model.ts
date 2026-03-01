export interface CreateTurnDto {
  identification: string;
  idLocation: number;
  serviceId: number;
}

export interface UpdateTurnDto {
  id: number;
  newStatus: string;
}

export interface TurnResponse {
  id: number;
  turnCode: string;
  identification: string;
  idLocation: number;
  locationName: string;
  serviceId: number;      
  serviceName: string; 
  dateCreation: string;
  dateExpiration: string;
  dateActivation?: string;
  status: string;
  minutesRemaining: number;
}

export interface TurnFilterDto {
  identification?: string;
  status?: string;
  locationId?: number;
  serviceId?: number;
  dateFrom?: string;
  dateTo?: string;
}
