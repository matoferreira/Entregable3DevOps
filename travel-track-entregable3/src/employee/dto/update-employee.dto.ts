import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'John Doe' })
    name?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ example: 'john.doe@example.com' })
    email?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '+59897123456' })
    phone?: string;
}