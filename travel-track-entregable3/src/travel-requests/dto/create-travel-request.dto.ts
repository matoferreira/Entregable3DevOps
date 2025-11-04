import { IsUUID, IsString, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTravelRequestDto {
  @ApiProperty({
    description: 'ID del empleado que solicita el viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  employeeId: string;

  @ApiProperty({
    description: 'Destino del viaje solicitado',
    example: 'Montevideo, Uruguay',
  })
  @IsString()
  destination: string;

  @ApiProperty({
    description: 'Duración solicitada del viaje en días',
    example: 7,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  days: number;
}
