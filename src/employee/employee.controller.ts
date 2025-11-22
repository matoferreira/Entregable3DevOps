import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './employee.entity';

@ApiTags('employees')
@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo empleado' })
    @ApiResponse({
        status: 201,
        description: 'Empleado creado exitosamente',
        type: Employee,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos',
    })
    createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(createEmployeeDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un empleado existente' })
    @ApiParam({
        name: 'id',
        description: 'ID del empleado',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Empleado actualizado exitosamente',
        type: Employee,
    })
    @ApiResponse({
        status: 404,
        description: 'Empleado no encontrado',
    })
    updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(id, updateEmployeeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un empleado' })
    @ApiParam({
        name: 'id',
        description: 'ID del empleado',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Empleado eliminado exitosamente',
        type: Employee,
    })
    @ApiResponse({
        status: 404,
        description: 'Empleado no encontrado',
    })
    deleteEmployee(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los empleados' })
    @ApiResponse({
        status: 200,
        description: 'Lista de empleados',
        type: [Employee],
    })
    findAllEmployees() {
        return this.employeeService.findAllEmployees();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un empleado por ID' })
    @ApiParam({
        name: 'id',
        description: 'ID del empleado',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Empleado encontrado',
        type: Employee,
    })
    @ApiResponse({
        status: 404,
        description: 'Empleado no encontrado',
    })
    getEmployeeById(@Param('id') id: string) {
        return this.employeeService.getEmployeeById(id);
    }
}
