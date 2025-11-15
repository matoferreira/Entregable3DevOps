import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const appVersion = configService.get<string>('appVersion') || '1.0.0';
  const appName = configService.get<string>('appName') || 'travel-track-api';
  const nodeEnv = configService.get<string>('nodeEnv') || 'development';

  const config = new DocumentBuilder()
    .setTitle('Travel Requests API')
    .setDescription('API para gestionar solicitudes de viaje corporativo')
    .setVersion(appVersion)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application ${appName} is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`📦 Version: ${appVersion}`);
}
bootstrap();
