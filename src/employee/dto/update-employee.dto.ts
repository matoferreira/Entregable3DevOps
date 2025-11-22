import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeDto {
    @ApiProperty({
        description: 'Nombre completo del empleado',
        example: 'John Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Correo del empleado',
        example: 'john.doe@example.com',
        required: false,
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: 'Teléfono del empleado',
        example: '+59897123456',
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;
}