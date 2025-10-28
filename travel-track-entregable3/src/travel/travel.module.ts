import { Module } from '@nestjs/common';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule],
  controllers: [TravelController],
  providers: [TravelService]
})
export class TravelModule {}
