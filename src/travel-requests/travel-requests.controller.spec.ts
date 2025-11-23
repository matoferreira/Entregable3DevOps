import { Test, TestingModule } from '@nestjs/testing';
import { TravelRequestsController } from './travel-requests.controller';
import { TravelRequestsService } from './travel-requests.service';
import { EmployeeModule } from '../employee/employee.module';

describe('TravelRequestsController', () => {
  let controller: TravelRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmployeeModule],
      controllers: [TravelRequestsController],
      providers: [TravelRequestsService],
    }).compile();

    controller = module.get<TravelRequestsController>(TravelRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
