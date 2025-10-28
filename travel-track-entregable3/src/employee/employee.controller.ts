import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post()
    createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(createEmployeeDto);
    }

    @Get(':id')
    getEmployeeById(@Param('id') id: string) {
        return this.employeeService.getEmployeeById(id);
    }

    @Put(':id')
    updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(id, updateEmployeeDto);
    }

    @Delete(':id')
    deleteEmployee(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }

    @Get()
    findAllEmployees() {
        return this.employeeService.findAllEmployees();
    }
}
