import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import promBundle from 'express-prom-bundle';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const metricsMiddleware = promBundle({
    includeMethod: true, // Включает HTTP-метод (GET, POST и т.д.) в метрики
    includePath: true, // Включает путь (роут) запроса,
    includeStatusCode: true,
    includeUp: true,
    metricType: 'histogram', // Создает гистограммы для расчета p95/p99
  });
  app.use(metricsMiddleware);
  app.enableCors({
    origin: 'https://web-lab-b2je.vercel.app', // Замените на точный URL вашего фронтенда!
    credentials: true, // Разрешает передачу кук и заголовков авторизации
  });
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log('Ok');
  })
  .catch((err) => {
    console.error('Something went wrong', err);
  });
