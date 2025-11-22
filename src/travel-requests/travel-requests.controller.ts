import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TravelRequestsService } from './travel-requests.service';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
import { TravelRequest } from './travel-request.entity';

@ApiTags('travel-requests')
@Controller('travel-requests')
export class TravelRequestsController {
  constructor(private readonly service: TravelRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva solicitud de viaje' })
  @ApiResponse({
    status: 201,
    description: 'Solicitud de viaje creada exitosamente',
    type: TravelRequest,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Empleado no encontrado',
  })
  create(@Body() dto: CreateTravelRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de viaje' })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes de viaje',
    type: [TravelRequest],
  })
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Aprobar una solicitud de viaje' })
  @ApiParam({
    name: 'id',
    description: 'ID de la solicitud de viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud aprobada exitosamente',
    type: TravelRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'La solicitud ya fue procesada',
  })
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Rechazar una solicitud de viaje' })
  @ApiParam({
    name: 'id',
    description: 'ID de la solicitud de viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud rechazada exitosamente',
    type: TravelRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'La solicitud ya fue procesada',
  })
  reject(@Param('id') id: string) {
    return this.service.reject(id);
  }
}
