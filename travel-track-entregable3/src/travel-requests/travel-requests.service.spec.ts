import { Test, TestingModule } from '@nestjs/testing';
import { TravelRequestsService } from './travel-requests.service';
import { EmployeeService } from '../employee/employee.service';

describe('TravelRequestsService', () => {
  let service: TravelRequestsService;

  const mockTravelRequestsService = {
    getEmployeeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelRequestsService,
        {
          provide: EmployeeService,
          useValue: mockTravelRequestsService,
        }
      ],
    }).compile();

    service = module.get<TravelRequestsService>(TravelRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
