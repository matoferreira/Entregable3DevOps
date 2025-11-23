import { ApiProperty } from '@nestjs/swagger';

export type TravelStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export class Travel {
  @ApiProperty({
    description: 'ID único del viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del empleado que realiza el viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  employeeId!: string;

  @ApiProperty({
    description: 'Destino del viaje',
    example: 'Montevideo, Uruguay',
  })
  destination!: string;

  @ApiProperty({
    description: 'Duración del viaje en días',
    example: 5,
  })
  days!: number;

  @ApiProperty({
    description: 'Estado actual del viaje',
    enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED'],
    example: 'PLANNED',
  })
  status!: TravelStatus;

  @ApiProperty({
    description: 'Fecha de creación del viaje',
    example: '2025-11-04T10:30:00.000Z',
  })
  createdAt!: Date;
}
