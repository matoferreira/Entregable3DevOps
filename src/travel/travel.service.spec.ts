import { Test, TestingModule } from '@nestjs/testing';
import { TravelService } from './travel.service';
import { EmployeeModule } from '../employee/employee.module';

describe('TravelService', () => {
  let service: TravelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmployeeModule],
      providers: [TravelService],
    }).compile();

    service = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
