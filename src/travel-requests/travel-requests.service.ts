import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TravelRequest } from './travel-request.entity';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class TravelRequestsService {
  private requests: TravelRequest[] = [];

  constructor(private readonly employeeService: EmployeeService) {}

  create(dto: CreateTravelRequestDto) {
    const emp = this.employeeService.getEmployeeById(dto.employeeId);

    const request: TravelRequest = {
      id: randomUUID(),
      employeeId: emp.id,
      destination: dto.destination,
      days: dto.days,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.requests.push(request);
    return request;
  }

  findAll() {
    return this.requests;
  }

  approve(id: string) {
    const req = this.requests.find(r => r.id === id);
    if (!req) throw new NotFoundException('Request not found');
    if (req.status !== 'PENDING') throw new BadRequestException('Already processed');
    req.status = 'APPROVED';
    req.approvedAt = new Date();
    return req;
  }

  reject(id: string) {
    const req = this.requests.find(r => r.id === id);
    if (!req) throw new NotFoundException('Request not found');
    if (req.status !== 'PENDING') throw new BadRequestException('Already processed');
    req.status = 'REJECTED';
    return req;
  }
}
