import { ApiProperty } from '@nestjs/swagger';

export type TravelRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export class TravelRequest {
  @ApiProperty({
    description: 'ID único de la solicitud de viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del empleado que solicita el viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  employeeId: string;

  @ApiProperty({
    description: 'Destino del viaje solicitado',
    example: 'Montevideo, Uruguay',
  })
  destination: string;

  @ApiProperty({
    description: 'Duración solicitada del viaje en días',
    example: 7,
  })
  days: number;

  @ApiProperty({
    description: 'Estado de la solicitud',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    example: 'PENDING',
  })
  status: TravelRequestStatus;

  @ApiProperty({
    description: 'Fecha de creación de la solicitud',
    example: '2025-11-04T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de aprobación de la solicitud',
    example: '2025-11-04T14:30:00.000Z',
    required: false,
  })
  approvedAt?: Date;

  @ApiProperty({
    description: 'ID del usuario que aprobó la solicitud',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  approvedBy?: string;
}
