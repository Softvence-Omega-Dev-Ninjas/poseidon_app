import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFiller implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message: string | object =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.log('Global HttpException - message ', message);

    // response.status(status).json({ ...message });

    if (typeof message === 'object' && message !== null) {
      response.status(status).json({ ...message, statusCode: status });
    } else {
      response.status(status).json({ message });
    }

    // response.status(status).json({
    //   statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });
  }
}
