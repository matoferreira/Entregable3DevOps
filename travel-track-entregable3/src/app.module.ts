import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { TravelModule } from './travel/travel.module';
import { TravelRequestsModule } from './travel-requests/travel-requests.module';

@Module({
  imports: [EmployeeModule, TravelModule, TravelRequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
