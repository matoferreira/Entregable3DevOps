import { Injectable } from '@nestjs/common';
import { Travel } from './travel.entity';
import { CreateTravelDto } from './dto/create-travel.dto';
import { randomUUID } from 'crypto';
import { EmployeeService } from '../employee/employee.service';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class TravelService {
  private travels: Travel[] = [];

  constructor(private readonly employeeService: EmployeeService) {}

  create(dto: CreateTravelDto): Travel {
    const emp = this.employeeService.getEmployeeById(dto.employeeId);
    if (!emp) throw new BadRequestException('Employee does not exist');

    const travel: Travel = {
      id: randomUUID(),
      ...dto,
      status: 'PLANNED' as const,
      createdAt: new Date(),
    };
    this.travels.push(travel);
    return travel;
  }

  findAll(): Travel[] {
    return this.travels;
  }
}
