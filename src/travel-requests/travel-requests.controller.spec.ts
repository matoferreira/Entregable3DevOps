import { Test, TestingModule } from '@nestjs/testing';
import { TravelRequestsController } from './travel-requests.controller';

describe('TravelRequestsController', () => {
  let controller: TravelRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelRequestsController],
    }).compile();

    controller = module.get<TravelRequestsController>(TravelRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
