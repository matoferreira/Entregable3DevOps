import { ApiProperty } from '@nestjs/swagger';

export class Employee {
    @ApiProperty({
        description: 'ID único del empleado',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'Nombre completo del empleado',
        example: 'John Doe',
    })
    name: string;

    @ApiProperty({
        description: 'Correo electrónico del empleado',
        example: 'john.doe@example.com',
        required: false,
    })
    email?: string;

    @ApiProperty({
        description: 'Teléfono de contacto del empleado',
        example: '+59897123456',
        required: false,
    })
    phone?: string;
}