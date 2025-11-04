import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { TravelRequestsService } from './travel-requests.service';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';

@Controller('travel-requests')
export class TravelRequestsController {
  constructor(private readonly service: TravelRequestsService) {}

  @Post()
  create(@Body() dto: CreateTravelRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(id);
  }
}
