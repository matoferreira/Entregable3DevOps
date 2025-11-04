import { Controller, Post, Get, Body } from '@nestjs/common';
import { TravelService } from './travel.service';
import { CreateTravelDto } from './dto/create-travel.dto';

@Controller('travels')
export class TravelController {
  constructor(private readonly service: TravelService) {}

  @Post()
  create(@Body() dto: CreateTravelDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
