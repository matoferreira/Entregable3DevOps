import { IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Nombre completo del empleado',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Correo del empleado',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Teléfono del empleado',
    example: '+59897123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
