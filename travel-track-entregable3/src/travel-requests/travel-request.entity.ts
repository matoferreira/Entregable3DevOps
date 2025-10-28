export type TravelRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export class TravelRequest {
  id: string;
  employeeId: string;
  destination: string;
  days: number;
  status: TravelRequestStatus;
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}
