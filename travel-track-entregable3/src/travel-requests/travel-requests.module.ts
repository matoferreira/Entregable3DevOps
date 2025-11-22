import { Module } from '@nestjs/common';
import { TravelRequestsController } from './travel-requests.controller';
import { TravelRequestsService } from './travel-requests.service';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule],
  controllers: [TravelRequestsController],
  providers: [TravelRequestsService],
  exports: [TravelRequestsService],
})
export class TravelRequestsModule {}
