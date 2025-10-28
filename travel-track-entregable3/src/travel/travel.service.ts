import { Injectable } from '@nestjs/common';
import { Travel } from './travel.entity';
import { CreateTravelDto } from './dto/create-travel.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TravelService {
  private travels: Travel[] = [];

  create(dto: CreateTravelDto) {
    const travel: Travel = {
      id: randomUUID(),
      ...dto,
      status: 'PLANNED',
      createdAt: new Date(),
    };
    this.travels.push(travel);
    return travel;
  }

  findAll() {
    return this.travels;
  }
}
