import { Injectable, NotFoundException} from '@nestjs/common';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class EmployeeService {
    private employees: Employee[] = [];

    createEmployee(dto: CreateEmployeeDto): Employee {
        const newEmp = { id: randomUUID(), ...dto };
        this.employees.push(newEmp);
        return newEmp;
    }

    getEmployeeById(id: string) {
        const employee = this.employees.find((emp) => emp.id === id);
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        return employee;
    }

    updateEmployee(id: string, dto: UpdateEmployeeDto) {
        const employee = this.employees.find((emp) => emp.id === id);
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        if (dto.name !== undefined) employee.name = dto.name;
        if (dto.email !== undefined) employee.email = dto.email;
        if (dto.phone !== undefined) employee.phone = dto.phone;
        return employee;
    }

    deleteEmployee(id: string) {
        const employee = this.employees.find((emp) => emp.id === id);
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        this.employees = this.employees.filter((emp) => emp.id !== id);
        return employee;
    }

    findAllEmployees() {
        return this.employees;
    }
}
