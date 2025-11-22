import { Injectable, OnModuleInit } from '@nestjs/common';
import { EmployeeService } from './employee/employee.service';
import { TravelService } from './travel/travel.service';
import { TravelRequestsService } from './travel-requests/travel-requests.service';

@Injectable()
export class DataInitializerService implements OnModuleInit {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly travelService: TravelService,
    private readonly travelRequestsService: TravelRequestsService,
  ) {}

  onModuleInit() {
    this.initializeData();
  }

  private initializeData() {
    // Crear empleados de ejemplo
    const employee1 = this.employeeService.createEmployee({
      name: 'Juan Pérez',
      email: 'juan.perez@traveltrack.com',
      phone: '+34 612 345 678',
    });

    const employee2 = this.employeeService.createEmployee({
      name: 'María García',
      email: 'maria.garcia@traveltrack.com',
      phone: '+34 623 456 789',
    });

    const employee3 = this.employeeService.createEmployee({
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@traveltrack.com',
      phone: '+34 634 567 890',
    });

    const employee4 = this.employeeService.createEmployee({
      name: 'Ana Martínez',
      email: 'ana.martinez@traveltrack.com',
      phone: '+34 645 678 901',
    });

    // Crear viajes de ejemplo
    this.travelService.create({
      employeeId: employee1.id,
      destination: 'Barcelona',
      days: 4,
    });

    this.travelService.create({
      employeeId: employee2.id,
      destination: 'Madrid',
      days: 2,
    });

    this.travelService.create({
      employeeId: employee3.id,
      destination: 'Valencia',
      days: 2,
    });

    // Crear solicitudes de viaje de ejemplo
    const request1 = this.travelRequestsService.create({
      employeeId: employee1.id,
      destination: 'París',
      days: 4,
    });

    const request2 = this.travelRequestsService.create({
      employeeId: employee2.id,
      destination: 'Londres',
      days: 3,
    });

    const request3 = this.travelRequestsService.create({
      employeeId: employee3.id,
      destination: 'Berlín',
      days: 5,
    });

    const request4 = this.travelRequestsService.create({
      employeeId: employee4.id,
      destination: 'Ámsterdam',
      days: 2,
    });

    // Aprobar una solicitud
    this.travelRequestsService.approve(request1.id);

    // Rechazar otra solicitud
    this.travelRequestsService.reject(request3.id);

    console.log('✅ Datos de ejemplo inicializados correctamente');
    console.log(`   - ${4} empleados creados`);
    console.log(`   - ${3} viajes planificados`);
    console.log(`   - ${4} solicitudes de viaje (1 aprobada, 1 rechazada, 2 pendientes)`);
  }
}
