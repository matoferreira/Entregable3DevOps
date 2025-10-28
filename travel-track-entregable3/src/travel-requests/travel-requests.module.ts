import { Module } from '@nestjs/common';
import { TravelRequestsController } from './travel-requests.controller';
import { TravelRequestsService } from './travel-requests.service';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [EmployeeModule],
  controllers: [TravelRequestsController],
  providers: [TravelRequestsService]
})
export class TravelRequestsModule {}
