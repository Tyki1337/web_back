import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Определяем статус ответа (если это HTTP-ошибка — берем ее статус, иначе 500)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Получаем текст сообщения об ошибке
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (typeof message === 'object' && message !== null) {
      message = (message as any).message || message;
    }

    // Возвращаем фронтенду красивый, предсказуемый JSON
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: message,
    });
  }
}
