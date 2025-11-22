import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TravelService } from './travel.service';
import { CreateTravelDto } from './dto/create-travel.dto';
import { Travel } from './travel.entity';

@ApiTags('travels')
@Controller('travels')
export class TravelController {
  constructor(private readonly service: TravelService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo viaje' })
  @ApiResponse({
    status: 201,
    description: 'Viaje creado exitosamente',
    type: Travel,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o empleado no existe',
  })
  create(@Body() dto: CreateTravelDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los viajes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes',
    type: [Travel],
  })
  findAll() {
    return this.service.findAll();
  }
}
