import { IsUUID, IsString, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTravelDto {
  @ApiProperty({
    description: 'ID del empleado que realiza el viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  employeeId!: string;

  @ApiProperty({
    description: 'Destino del viaje',
    example: 'Montevideo, Uruguay',
  })
  @IsString()
  destination!: string;

  @ApiProperty({
    description: 'Duración del viaje en días',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  days!: number;
}
