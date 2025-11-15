import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('general')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Bienvenida' })
  @ApiResponse({
    status: 200,
    description: 'Bienvenida de la API',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificar estado del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Estado del servicio',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        timestamp: {
          type: 'string',
          example: '2025-11-15T12:00:00.000Z',
        },
        service: {
          type: 'string',
          example: 'travel-track-api',
        },
        version: {
          type: 'string',
          example: '1.0.0',
        },
        environment: {
          type: 'string',
          example: 'production',
        },
      },
    },
  })
  health() {
    return this.appService.getHealth();
  }
}
