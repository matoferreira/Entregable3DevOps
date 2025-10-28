export type TravelStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export class Travel {
  id: string;
  employeeId: string;
  destination: string;
  days: number;
  status: TravelStatus;
  createdAt: Date;
}
