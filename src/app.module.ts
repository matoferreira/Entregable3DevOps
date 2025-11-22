import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { TravelModule } from './travel/travel.module';
import { TravelRequestsModule } from './travel-requests/travel-requests.module';
import configuration from './config/configuration';
import { DataInitializerService } from './data-initializer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    EmployeeModule,
    TravelModule,
    TravelRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataInitializerService],
})
export class AppModule {}
